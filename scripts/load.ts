import { exec } from 'child_process';
import 'dotenv/config';
import * as fs from 'fs';
import * as T from "hella-types";
import { Db, ObjectId } from 'mongodb';
import { normalize } from 'path';
import simpleGit from 'simple-git';
import { promisify } from 'util';
import getDb from "../src/db";
const objectHash = require('object-hash');

class G {
    static localPath = 'ArknightsGameData_YoStar/en_US/gamedata';
    static dataPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata';
    static backupPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/5ba509ad5a07f17b7e220a25f1ff66794dd79af1/en_US/gamedata'; // last commit before removing en_US folder
    static cnDataPath = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata';

    static collectionDeps = {
        'deployable': ['archetype', 'range', 'skill', 'skin'],
        'operator': ['archetype', 'base', 'module', 'paradox', 'range', 'skill', 'skin', 'deployable'],
        'recruit': ['operator', 'archetype', 'base', 'module', 'paradox', 'range', 'skill', 'skin', 'deployable'],
    }
    static collectionsToLoad = {
        archetype: true,
        base: true,
        module: true,
        paradox: true,
        range: true,
        skill: true,
        skin: true,
        deployable: true,
        operator: true,
        cc: true,
        ccb: false,
        ccblegacy: false,
        define: true,
        enemy: true,
        event: true,
        gacha: true,
        item: true,
        recruit: true,
        rogue: true,
        sandbox: true,
        stage: true,
        cn: true
    }

    static logDate = (msg: string) => console.log(`[${new Date().toLocaleString()}] ${msg}`);
    static logTime = (msg: string) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
    static log = (msg: string) => console.log(msg);
    static execWait = promisify(exec);

    static archetypeDict: { [key: string]: string } = {};       // Archetype id -> archetype name
    static baseDict: { [key: string]: T.Base } = {};            // Base skill id -> Base object
    static deployDict: { [key: string]: T.Deployable } = {}; // Deployable id -> Deployable object
    static moduleDict: { [key: string]: T.Module } = {};          // Module id -> Module object
    static operatorDict: { [key: string]: T.Operator } = {};        // Operator id -> Operator object
    static paradoxDict: { [key: string]: T.Paradox } = {};         // Operator id -> Paradox object
    static rangeDict: { [key: string]: T.GridRange } = {};           // Range id -> Range object
    static skillDict: { [key: string]: T.Skill } = {};           // Skill id -> Skill object
    static skinArrDict: { [key: string]: T.Skin[] } = {};         // Operator id -> Skin object array
    static skinDict: { [key: string]: T.Skin } = {};            // Skin id -> Skin object
    static cnarchetypeDict: { [key: string]: string } = {};
    static cnbaseDict: { [key: string]: T.Base } = {};
    static cnmoduleDict: { [key: string]: T.Module } = {};
    static cnparadoxDict: { [key: string]: T.Paradox } = {};
    static cnrangeDict: { [key: string]: T.GridRange } = {};
    static cnskillDict: { [key: string]: T.Skill } = {};
    static cnskinArrDict: { [key: string]: T.Skin[] } = {};

    static fetchLocal = true;
    static writeToDb = true;
    static updateAbout = true;
    static allGacha = false;

    static db: Db;
    static gameConsts: any;
    static commit: any;
    static date: number;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 0) {
        for (const key in G.collectionsToLoad) {
            G.collectionsToLoad[key] = false;
        }
        for (const arg of args) {
            if (G.collectionsToLoad.hasOwnProperty(arg)) {
                G.collectionsToLoad[arg] = true;
            }
            if (G.collectionDeps[arg]) {
                for (const dep of G.collectionDeps[arg]) {
                    G.collectionsToLoad[dep] = true;
                }
            }
        }
    }
    if (args.includes('allgacha')){
        G.allGacha = true;
        G.collectionsToLoad.gacha = true;
    }

    G.db = await getDb();

    if (!G.db)
        return console.error('Failed to connect to database');

    G.gameConsts = (await (await fetch('https://raw.githubusercontent.com/Awedtan/HellaBot/main/src/constants.json')).json()).gameConsts;
    const hash = (await simpleGit(G.localPath).log()).latest?.hash;
    G.commit = (await (await fetch(`https://api.github.com/repos/Kengxxiao/ArknightsGameData_YoStar/commits/${hash}`)).json());
    G.date = Math.round(Date.now() / 1000); // seconds since unix epoch

    G.logDate('Starting DB load');
    G.logDate(`Collections to load: ${Object.entries(G.collectionsToLoad).filter(([_, v]) => v).map(([k, _]) => k).join(', ')}`); // copilot fuckery

    if (G.writeToDb && G.updateAbout)
        await G.db.collection('about').updateOne({}, { $set: { date: G.date, hash: G.commit.sha, message: G.commit.commit.message } }, { upsert: true });

    if (G.collectionsToLoad.archetype)
        await loadArchetypes();
    if (G.collectionsToLoad.base)
        await loadBases();
    if (G.collectionsToLoad.module)
        await loadModules();
    if (G.collectionsToLoad.paradox)
        await loadParadoxes();
    if (G.collectionsToLoad.range)
        await loadRanges();
    if (G.collectionsToLoad.skill)
        await loadSkills();
    if (G.collectionsToLoad.skin)
        await loadSkins();
    if (G.collectionsToLoad.deployable)
        await loadDeployables();
    if (G.collectionsToLoad.operator)
        await loadOperators();

    if (G.collectionsToLoad.cc)
        await loadCC();
    if (G.collectionsToLoad.ccb)
        await loadCCB();
    if (G.collectionsToLoad.ccblegacy)
        await loadCCBLegacy();
    if (G.collectionsToLoad.define)
        await loadDefinitions();
    if (G.collectionsToLoad.enemy)
        await loadEnemies();
    if (G.collectionsToLoad.event)
        await loadEvents();
    if (G.collectionsToLoad.gacha)
        await loadGacha();
    if (G.collectionsToLoad.item)
        await loadItems();
    if (G.collectionsToLoad.recruit)
        await loadRecruit();
    if (G.collectionsToLoad.rogue)
        await loadRogueThemes();
    if (G.collectionsToLoad.sandbox)
        await loadSandboxes();
    if (G.collectionsToLoad.stage)
        await loadStages();

    if (G.collectionsToLoad.cn) {
        await loadCnArchetypes();
        await loadCnBases();
        await loadCnModules();
        await loadCnParadoxes();
        await loadCnRanges();
        await loadCnSkills();
        await loadCnSkins();
        await loadCnOperators();
    }

    G.logDate('Finished DB load');
    process.exit(0);
}

type Doc = {
    _id?: ObjectId,
    meta: {
        hash: string,
        created: string,
        updated: string,
        date: number,
    },
    canon: string,
    keys: string[],
    value: any
}

const getCollectionMetaInfo = async (collection: string) => await G.db.collection(collection).find({}, { projection: { 'value': 0 } }).toArray();

function createDoc(oldDocuments: any[], keys: string[], value: any): Doc {
    const createdHash = oldDocuments.find(doc => doc.canon === keys[0])?.meta?.created;
    return {
        meta: {
            hash: objectHash(
                {
                    keys: keys.map(key => key.toLowerCase()),
                    value: value
                },
                { respectType: false }
            ),
            created: createdHash ?? G.commit.sha,
            updated: G.commit.sha,
            date: G.date,
        },
        canon: keys[0],
        keys: keys.map(key => key.toLowerCase()),
        value: value
    }
}
async function fetchCnData(path: string): Promise<any> {
    const retries = 3;
    let attempt = 0;
    while (attempt < retries) {
        try {
            const res = await fetch(`${G.cnDataPath}/${path}`);
            if (!res.ok) {
                if (res.status === 429) {
                    await new Promise(resolve => setTimeout(resolve, 5000 * ++attempt));
                    continue;
                }
                throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
            }
            try {
                return await res.json();
            } catch (jsonErr) {
                throw new Error(`Failed to parse JSON from response for ${path}: ${(jsonErr as Error).message}`);
            }
        } catch (err) {
            attempt++;
            if (attempt >= retries) {
                G.log(`Error loading ${path}: ${(err as Error).message}`);
                throw err;
            }
        }
    }
    throw new Error(`Failed to load data for ${path} after ${retries} attempts`);
}
async function fetchData(path: string): Promise<any> {
    const retries = 3;
    let attempt = 0;
    while (attempt < retries) {
        try {
            if (G.fetchLocal) {
                const filePath = normalize(`${G.localPath}/${path}`.replace(/\\/g, '/'));
                if (!fs.existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }
                const content = fs.readFileSync(filePath, 'utf8');
                try {
                    return JSON.parse(content);
                } catch (jsonErr) {
                    throw new Error(`Failed to parse JSON from ${filePath}: ${(jsonErr as Error).message}`);
                }
            } else {
                const res = await fetch(`${G.dataPath}/${path}`);
                if (!res.ok) {
                    if (res.status === 429) {
                        await new Promise(resolve => setTimeout(resolve, 5000 * ++attempt));
                        continue;
                    }
                    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
                }
                try {
                    return await res.json();
                } catch (jsonErr) {
                    throw new Error(`Failed to parse JSON from response for ${path}: ${(jsonErr as Error).message}`);
                }
            }
        } catch (err) {
            if (err.message.includes('File not found')) break;
            if (++attempt >= retries) {
                throw err;
            }
        }
    }
    throw new Error(`Failed to load data for ${path} after ${retries} attempts`);
}
function filterDocuments(oldDocuments: any[], newDocuments: Doc[]): Doc[] {
    return newDocuments.filter(newDoc => {
        const oldDoc = oldDocuments.find(old => old.canon === newDoc.canon);
        const docsAreEqual = oldDoc && oldDoc.meta.hash === newDoc.meta.hash;
        return !docsAreEqual;
    });
}
async function processWithConcurrencyLimit(items, limit, handler) {
    let index = 0;
    while (index < items.length) {
        const batch = items.slice(index, index + limit);
        await Promise.allSettled(batch.map(item => handler(item)));
        index += limit;
    }
}
function readOperatorIntoArr(opId: string, charFile, charEquip, charBaseBuffs, oldDocuments) {
    const arr: Doc[] = [];

    if (['char_512_aprot'].includes(opId)) return []; // why are there two shalems???
    if (!opId.startsWith('char_')) return [];

    // ID AND DATA
    const opData = charFile[opId];
    if (['notchar1', 'notchar2'].includes(opData.subProfessionId)) return []; // Summons and deployables dont have tags, skip them

    // RECRUIT ID
    const rarityId = G.gameConsts.tagValues[opData.rarity] ?? 1;
    const positionId = G.gameConsts.tagValues[opData.position.toLowerCase()] ?? 1;
    const classId = G.gameConsts.tagValues[G.gameConsts.professions[opData.profession].toLowerCase()] ?? 1;
    let tagId = 1;
    for (const tag of opData.tagList) {
        tagId *= G.gameConsts.tagValues[tag.toLowerCase()] ?? 1;
    }
    // Robot is not explicitly defined as a tag, infer from operator description instead
    if (opData.itemDesc !== null && opData.itemDesc.includes('robot')) {
        tagId *= G.gameConsts.tagValues['robot'];
    }
    const recruitId = rarityId * positionId * classId * tagId;

    // ARCHETYPE
    const opArchetype = G.archetypeDict[opData.subProfessionId] ?? G.cnarchetypeDict[opData.subProfessionId];

    // RANGE
    const opRange = G.rangeDict[opData.phases[opData.phases.length - 1].rangeId] ?? G.cnrangeDict[opData.phases[opData.phases.length - 1]];

    // SKILLS
    const opSkills = opData.skills.map(s => G.skillDict[s.skillId] ?? G.cnskillDict[s.skillId]);

    // MODULES
    const opModules: any[] = [];
    if (charEquip.hasOwnProperty(opId)) {
        for (const module of charEquip[opId]) {
            if (module.includes('uniequip_001')) continue;
            opModules.push(G.moduleDict[module] ?? G.cnmoduleDict[module]);
        }
    }

    // SKINS
    const opSkins = G.skinArrDict[opId] ?? G.cnskinArrDict[opId] ?? [];

    // BASE SKILLS
    const opBases: any[] = [];
    if (charBaseBuffs.hasOwnProperty(opId)) {
        for (const buff of charBaseBuffs[opId].buffChar) {
            for (const baseData of buff.buffData) {
                opBases.push({ condition: baseData, skill: G.baseDict[baseData.buffId] ?? G.cnbaseDict[baseData.buffId] });
            }
        }
    }

    // PARADOX SIMULATION
    const opParadox = G.paradoxDict[opId] ?? G.cnparadoxDict[opId] ?? null;

    const opName = opData.name.toLowerCase();
    const keyArr: string[] = [opId, opName, opName.replace(/['-]/g, ''), opName.replace(/['-]/g, ' ')];
    keyArr.push(...keyArr.slice(1).filter(k => k.includes(' the ')).map(k => k.split(' the ')[0] + ' alter'));

    // not intended to be a comprehensive list, just what i call them
    const hardcodeOpId = {
        'char_4055_bgsnow': ['pozemka'],
        'char_4064_mlynar': ['mlynar'],
        'char_002_amiya': ['caster amiya', 'amiya caster'],
        'char_1001_amiya2': ['guard amiya', 'amiya guard'],
        'char_1037_amiya3': ['medic amiya', 'amiya medic'],
        'char_1012_skadi2': ['skalter'],
        'char_1013_chen2': ['chalter'],
        'char_1014_nearl2': ['ntr'],
        'char_1023_ghost2': ['spalter'],
        'char_1026_gval2': ['gavialter'],
        'char_1028_texas2': ['texalter'],
        'char_1020_reed2': ['reedalter'],
        'char_1029_yato2': ['yalter'],
        'char_1016_agoat2': ['eyjafyalla the hvit aska', 'eyjalter'],
        'char_1033_swire2': ['swalter'],
        'char_1034_jesca2': ['jessicalter'],
        'char_1035_wisdel': ['wisadel', 'w alter', 'walter'],
        'char_1019_siege2': ['salter']
    }
    keyArr.push(...hardcodeOpId[opId]);

    arr.push(createDoc(oldDocuments, keyArr,
        {
            id: opId,
            archetype: opArchetype,
            bases: opBases,
            data: opData,
            modules: opModules,
            paradox: opParadox,
            range: opRange,
            recruit: recruitId,
            skills: opSkills,
            skins: opSkins,
        }
    ));

    return arr;
}
async function updateDb(collection: string, dataArr: Doc[]) {
    const unique = new Set();
    for (const datum of dataArr) {
        if (unique.has(datum.canon)) {
            G.log(`Duplicate canon in ${collection}: ${datum.canon}`);
            continue;
        }
        unique.add(datum.canon);
    }

    if (G.writeToDb && dataArr.length > 0) {
        G.logTime(`Writing ${dataArr.length} documents to ${collection}`);
        const filter = { canon: { $in: dataArr.map(datum => datum.canon) } };
        await G.db.collection(collection).deleteMany(filter);
        await G.db.collection(collection).insertMany(dataArr);
    }
}

async function loadGeneric(collection: string, func: () => Promise<Doc[]>) {
    G.logTime(`Starting ${collection}...`);

    const dataArr = await func();

    if (dataArr.length === 0) {
        G.logTime('Up to date')
    }
    else {
        G.logTime(`Found ${dataArr.length} documents to be updated`);
        await updateDb(collection, dataArr);
        G.logTime(`Finished ${collection}`);
    }
}

async function loadArchetypes() {
    await loadGeneric('archetype',
        async () => {
            const collection = "archetype";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const moduleTable = await fetchData('excel/uniequip_table.json');
            const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

            const dataArr = filterDocuments(oldDocuments,
                Object.values(subProfDict).map(subProf => {
                    G.archetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
                    return createDoc(oldDocuments, [subProf.subProfessionId], subProf.subProfessionName);
                })
            );
            return dataArr;
        });
}
async function loadBases() {
    await loadGeneric('base',
        async () => {
            const collection = "base";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const buildingData = await fetchData('excel/building_data.json');
            const buffs: { [key: string]: any } = buildingData.buffs;

            const dataArr = filterDocuments(oldDocuments,
                Object.values(buffs).map(buff => {
                    G.baseDict[buff.buffId] = buff;
                    return createDoc(oldDocuments, [buff.buffId], buff);
                })
            );

            for (const datum of dataArr) {
                try {
                    T.BaseZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nBase type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }
            return dataArr;
        });
}
async function loadCC() {
    await loadGeneric('cc',
        async () => {
            const collection = "cc";
            const oldDocuments = await getCollectionMetaInfo(collection);
            const ccStages = G.gameConsts.ccStages;

            const dataArr = filterDocuments(oldDocuments,
                await Promise.all(ccStages.map(async stage => {
                    const levels = await fetchData(`levels/${stage.levelId}.json`);
                    return createDoc(oldDocuments, [stage.levelId.split('/')[stage.levelId.split('/').length - 1], stage.name], { const: stage, levels: levels });
                })
                )
            );

            for (const datum of dataArr) {
                try {
                    T.CCStageZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nCC type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadCCB() {
    /*
    Canonical key: seasonId
    Additional keys: name
    */

    const start = Date.now();
    const collection = ["ccb", "ccb/stage"];
    const oldDocuments = await getCollectionMetaInfo(collection[0]);
    const oldStageDocs = await getCollectionMetaInfo(collection[1]);

    const crisisDetails: any = JSON.parse((await G.execWait('python3 scripts/crisisv2.py')).stdout);

    if (!crisisDetails || !crisisDetails.info)
        return console.log('No crisisv2 data was found!')

    const mapStageDataMap: { [key: string]: any } = crisisDetails.info.mapStageDataMap;
    const stageDict: { [key: string]: any } = {};
    for (const stage of Object.values(mapStageDataMap)) {
        const levels = await fetchData(`levels/${stage.levelId.toLowerCase()}.json`);
        stageDict[stage.stageId] = { excel: stage, levels: levels };
    }

    const dataArr = filterDocuments(oldDocuments,
        [createDoc(oldDocuments, [crisisDetails.info.seasonId], { seasonId: crisisDetails.info.seasonId, stageDict: stageDict })]
    );
    const stageArr = filterDocuments(oldStageDocs,
        await Promise.all(Object.values(stageDict).map(async stage =>
            createDoc(oldStageDocs, [stage.excel.stageId, stage.excel.name, stage.excel.code], stage)
        ))
    );

    for (const datum of dataArr) {
        try {
            T.CCSeasonZod.parse(datum.value);
        } catch (e: any) {
            G.log('\nCCB type conformity error: ' + datum.keys);
            G.log(e);
            break;
        }
    }

    await updateDb(collection[0], dataArr);
    await updateDb(collection[1], stageArr);
    console.log(`${dataArr.length} CCB seasons loaded in ${(Date.now() - start) / 1000}s`);
    console.log(`${stageArr.length} CCB stages loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadCCBLegacy() {
    await loadGeneric('ccblegacy',
        async () => {
            const collection = "ccblegacy";
            const oldDocuments = await getCollectionMetaInfo(collection);
            const ccbStages = G.gameConsts.ccbStages; // legacy, manually collected data

            const dataArr = filterDocuments(oldDocuments,
                await Promise.all(ccbStages.map(async stage => {
                    const levels = await fetchData(`levels/${stage.levelId}.json`);
                    return createDoc(oldDocuments, [stage.levelId.split('/')[stage.levelId.split('/').length - 1], stage.name], { const: stage, levels: levels });
                })
                )
            );

            for (const datum of dataArr) {
                try {
                    T.CCStageLegacyZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nCCB legacy type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadDefinitions() {
    await loadGeneric('define',
        async () => {
            const collection = "define";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const gamedataConst = await fetchData('excel/gamedata_const.json');
            const termDescriptionDict: { [key: string]: any } = gamedataConst.termDescriptionDict;

            const dataArr = filterDocuments(oldDocuments,
                Object.values(termDescriptionDict).map(definition =>
                    createDoc(oldDocuments, [definition.termId, definition.termName], definition)
                )
            );

            for (const datum of dataArr) {
                try {
                    T.DefinitionZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nDefinition type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadDeployables() {
    await loadGeneric('deployable',
        async () => {
            const collection = "deployable";
            const oldDocuments = await getCollectionMetaInfo(collection);
            const characterTable: { [key: string]: any } = await fetchData('excel/character_table.json');

            const dataArr = filterDocuments(oldDocuments,
                Object.keys(characterTable)
                    .filter(key => ['notchar1', 'notchar2'].includes(characterTable[key].subProfessionId))
                    .map(key => {
                        const data = characterTable[key];
                        return createDoc(oldDocuments, [key, data.name, data.name.replace(/['-]/g, '')], {
                            id: key,
                            archetype: G.archetypeDict[data.subProfessionId]
                                ?? G.cnarchetypeDict[data.subProfessionId],
                            data: data,
                            range: G.rangeDict[data.phases[data.phases.length - 1].rangeId]
                                ?? G.cnrangeDict[data.phases[data.phases.length - 1]]
                                ?? null,
                            skills: data.skills.map(s => G.skillDict[s.skillId] ?? G.cnskillDict[s.skillId] ?? null),
                            skins: G.skinArrDict[key] ?? G.cnskinArrDict[key] ?? []
                        })
                    })
            );

            for (const deploy of dataArr) {
                for (const key of deploy.keys) {
                    G.deployDict[key] = deploy.value;
                }
            }

            for (const datum of dataArr) {
                try {
                    T.DeployableZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nDeployable type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadEnemies() {
    await loadGeneric('enemy',
        async () => {
            const collection = "enemy";
            const oldDocuments = await getCollectionMetaInfo(collection);

            // Find matches between enemy_handbook_table and enemy_database
            // Stores data in enemyDict[enemy] = {excel, levels}
            //     excel = /excel/enemy_handbook_table.json
            //         Contains name, ID, category, description
            //     levels = /levels/enemydata/enemy_database.json
            //         Contains stats, skills, range
            // Unique enemy key is enemyId (enemy_1007_slime)
            // Additional keys are name (originium slug) and enemyIndex (b1) 
            const enemyHandbook = await fetchData('excel/enemy_handbook_table.json');
            const enemyDatabase = await fetchData('levels/enemydata/enemy_database.json');
            const enemyData: { [key: string]: any } = enemyHandbook.enemyData;

            const levelsLookup = {};
            for (const levels of enemyDatabase.enemies) {
                levelsLookup[levels.Key] = levels;
            }

            const dataArr = filterDocuments(oldDocuments,
                Object.values(enemyData).map(excel =>
                    createDoc(oldDocuments, [excel.enemyId, excel.name, excel.name.split('\'').join(''), excel.enemyIndex],
                        { excel: excel, levels: levelsLookup[excel.enemyId] })
                )
            );

            for (const datum of dataArr) {
                try {
                    T.EnemyZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nEnemy type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadEvents() {
    await loadGeneric('event',
        async () => {
            const collection = "event";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const activityTable = await fetchData('excel/activity_table.json');
            const basicInfo: { [key: string]: any } = activityTable.basicInfo;

            const dataArr = filterDocuments(oldDocuments,
                Object.values(basicInfo).map(event =>
                    createDoc(oldDocuments, [event.id], event)
                )
            );

            for (const datum of dataArr) {
                try {
                    T.GameEventZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nGame event type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadItems() {
    await loadGeneric('item',
        async () => {
            const collection = "item";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const itemTable = await fetchData('excel/item_table.json');
            const buildingData = await fetchData('excel/building_data.json');
            const items: { [key: string]: any } = itemTable.items;
            const manufactFormulas = buildingData.manufactFormulas; // Factory formulas
            const workshopFormulas = buildingData.workshopFormulas; // Workshop formulas

            const dataArr = filterDocuments(oldDocuments,
                Object.values(items).map(data => {
                    let formula = null;
                    if (data.buildingProductList.length > 0) {
                        if (data.buildingProductList[0].roomType === 'MANUFACTURE') {
                            formula = manufactFormulas[data.buildingProductList[0].formulaId];
                        }
                        else if (data.buildingProductList[0].roomType === 'WORKSHOP') {
                            formula = workshopFormulas[data.buildingProductList[0].formulaId];
                        }
                    }

                    return createDoc(oldDocuments, [data.itemId, data.name, data.name.split('\'').join('')], { data: data, formula: formula });
                })
            );

            for (const datum of dataArr) {
                try {
                    T.ItemZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nItem type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadModules() {
    await loadGeneric('module',
        async () => {
            const collection = "module";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const moduleTable = await fetchData('excel/uniequip_table.json');
            const battleDict = await fetchData('excel/battle_equip_table.json');
            const equipDict: { [key: string]: any } = moduleTable.equipDict;

            const dataArr = filterDocuments(oldDocuments,
                Object.values(equipDict).map(module => {
                    G.moduleDict[module.uniEquipId] = { info: module, data: battleDict[module.uniEquipId] ?? null };
                    return createDoc(oldDocuments, [module.uniEquipId], { info: module, data: battleDict[module.uniEquipId] ?? null });
                })
            );

            for (const datum of dataArr) {
                try {
                    T.ModuleZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nModule type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadOperators() {
    await loadGeneric('operator',
        async () => {
            const collection = "operator";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const operatorTable = await fetchData('excel/character_table.json');
            const patchChars = (await fetchData('excel/char_patch_table.json')).patchChars;
            const charEquip = (await fetchData('excel/uniequip_table.json')).charEquip;
            const charBaseBuffs = (await fetchData('excel/building_data.json')).chars;

            const opArr: Doc[] = [];
            for (const opId of Object.keys(operatorTable)) {
                opArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs, oldDocuments));
            }
            for (const opId of Object.keys(patchChars)) {
                opArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs, oldDocuments));
            }
            for (const op of opArr) {
                for (const key of op.keys) {
                    G.operatorDict[key] = op.value;
                }
            }

            const dataArr = filterDocuments(oldDocuments, opArr);

            for (const datum of dataArr) {
                try {
                    T.OperatorZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nOperator type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadParadoxes() {
    await loadGeneric('paradox',
        async () => {
            const collection = "paradox";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const handbookTable = await fetchData('excel/handbook_info_table.json');
            const stages: { [key: string]: any } = handbookTable.handbookStageData;

            const dataArr = filterDocuments(oldDocuments,
                await Promise.all(Object.values(stages).map(async excel => {
                    const levels = await fetchData(`levels/${excel.levelId.toLowerCase()}.json`);
                    G.paradoxDict[excel.charId] = { excel: excel, levels: levels };
                    return createDoc(oldDocuments, [excel.charId, excel.stageId], { excel: excel, levels: levels });
                }))
            );

            for (const datum of dataArr) {
                try {
                    T.ParadoxZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nParadox type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadRanges() {
    await loadGeneric('range',
        async () => {
            const collection = "range";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const rangeTable: { [key: string]: any } = await fetchData('excel/range_table.json');

            const dataArr = filterDocuments(oldDocuments,
                Object.values(rangeTable).map(range => {
                    G.rangeDict[range.id] = range;
                    return createDoc(oldDocuments, [range.id], range);
                })
            );

            for (const datum of dataArr) {
                try {
                    T.GridRangeZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nGrid range type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadGacha() {
    await loadGeneric('gacha',
        async () => {
            const collection = "gacha";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const gachaTable = await fetchData('excel/gacha_table.json');
            const gachaPoolClient: any[] = gachaTable.gachaPoolClient.sort((a, b) => b.openTime - a.openTime);

            const dataArr: Doc[] = [];

            if (G.allGacha) {
                for (let i = 0; i < Math.ceil(gachaPoolClient.length / 50); i++) {
                    const gachaPools = gachaPoolClient.slice(i * 50, (i + 1) * 50);
                    const poolDetails: any[] = JSON.parse((await G.execWait(`python3 scripts/gacha.py ${gachaPools.map(pool => pool.gachaPoolId).join(' ')}`)).stdout);

                    gachaPools.forEach((pool, i) => {
                        dataArr.push(createDoc(oldDocuments, [pool.gachaPoolId], { client: pool, details: poolDetails[i] }));
                    })
                }
            }
            else {
                // only get 12 most recent pools to minimize official api calls
                const gachaPools = gachaPoolClient.slice(0, 12);
                const poolDetails: any[] = JSON.parse((await G.execWait(`python3 scripts/gacha.py ${gachaPools.map(pool => pool.gachaPoolId).join(' ')}`)).stdout);

                gachaPools.forEach((pool, i) => {
                    dataArr.push(createDoc(oldDocuments, [pool.gachaPoolId], { client: pool, details: poolDetails[i] }));
                })
            }

            const filteredArr = filterDocuments(oldDocuments, dataArr);

            for (const datum of filteredArr) {
                try {
                    T.GachaPoolZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nGacha pool type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return filteredArr;
        });
}
async function loadRecruit() {
    await loadGeneric('recruitpool',
        async () => {
            function removeStyleTags(text: string) {
                const regex = /<.[a-z]{2,5}?\.[^<]+>|<\/[^<]*>|<color=[^>]+>/g;
                return text.replace(regex, '') ?? '';
            }

            const collection = "recruitpool";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const gachaTable = await fetchData('excel/gacha_table.json');
            const recruitDetail = gachaTable.recruitDetail;

            const lines = removeStyleTags(recruitDetail)
                .split('\n').map(line => line.trim()).filter(line => line.length > 0);
            const recruitables = `${lines[7]}/${lines[10]}/${lines[13]}/${lines[16]}/${lines[19]}/${lines[22]}`
                .split('/').map(line => G.operatorDict[line.trim().toLowerCase()].id);

            const dataArr = filterDocuments(oldDocuments, [createDoc(oldDocuments, ['recruitpool'], recruitables)]);

            return dataArr;
        });
}
async function loadRogueThemes() {
    /*
    Theme:
        Canonical key: index
        Additional keys: none
    Stages:
        Canonical key: id
        Additional keys: name, code
    */

    const start = Date.now();
    const collection = ["rogue", "rogue/stage", "rogue/toughstage", "rogue/relic", "rogue/variation"];
    const oldDocuments = await getCollectionMetaInfo(collection[0]);
    const oldStageDocs: any[] = [];
    const oldToughDocs: any[] = [];
    const oldRelicDocs: any[] = [];
    const oldVariationDocs: any[] = [];

    const rogueTable = await fetchData('excel/roguelike_topic_table.json');
    const rogueDetails: { [key: string]: any } = rogueTable.details;
    const rogueTopics: { [key: string]: any } = rogueTable.topics;

    const numOfThemes = Object.keys(rogueDetails).length;

    for (let i = 0; i < Object.keys(rogueDetails).length; i++) {
        oldStageDocs.push(await getCollectionMetaInfo(`${collection[1]}/${i}`));
        oldToughDocs.push(await getCollectionMetaInfo(`${collection[2]}/${i}`));
        oldRelicDocs.push(await getCollectionMetaInfo(`${collection[3]}/${i}`));
        oldVariationDocs.push(await getCollectionMetaInfo(`${collection[4]}/${i}`));
    }

    const rogueArr: Doc[] = [];
    for (let i = 0; i < numOfThemes; i++) {
        const rogueName = Object.values(rogueTopics)[i].name;
        const rogueTheme = Object.values(rogueDetails)[i];
        const rogueStages: { [key: string]: any } = rogueTheme.stages;
        const stageDict = {};
        const toughStageDict = {};
        const rogueRelics: { [key: string]: any } = rogueTheme.items;
        const relicDict = {};
        const rogueVariations: { [key: string]: any } = rogueTheme.variationData; // Variations are floor effects
        const variationDict = {};

        for (const excel of Object.values(rogueStages)) {
            const stageId = excel.id.toLowerCase();
            const levels = await fetchData(`levels/${excel.levelId.toLowerCase()}.json`);

            if (excel.difficulty === 'FOUR_STAR') {
                toughStageDict[stageId] = { excel: excel, levels: levels };
            }
            else if (excel.difficulty === 'NORMAL') {
                stageDict[stageId] = { excel: excel, levels: levels };
            }
        }

        for (const relic of Object.values(rogueRelics)) {
            if (relic.type === 'BAND' || relic.type == 'CAPSULE') continue; // Bands are squads, capsules are IS2 plays, skip these
            relicDict[relic.id.toLowerCase()] = relic;
        }

        for (const variation of Object.values(rogueVariations)) {
            variationDict[variation.id.toLowerCase()] = variation;
        }

        rogueArr[i] = createDoc(oldDocuments, [i.toString()], { name: rogueName, stageDict, toughStageDict, relicDict, variationDict });
    }

    const rogueStageArr: Doc[][] = [];
    const rogueToughArr: Doc[][] = [];
    const rogueRelicArr: Doc[][] = [];
    const rogueVariationArr: Doc[][] = [];
    rogueArr.forEach((theme, i) => {
        rogueStageArr[i] = Object.keys(theme.value.stageDict).map(key => {
            const stage = theme.value.stageDict[key];
            return createDoc(oldStageDocs[i], [stage.excel.id, stage.excel.name, stage.excel.code], stage);
        });
        rogueToughArr[i] = Object.keys(theme.value.toughStageDict).map(key => {
            const stage = theme.value.toughStageDict[key];
            return createDoc(oldToughDocs[i], [stage.excel.id, stage.excel.name, stage.excel.code], stage);
        });
        rogueRelicArr[i] = Object.keys(theme.value.relicDict).map(key => {
            const relic = theme.value.relicDict[key];
            return createDoc(oldRelicDocs[i], [relic.id, relic.name], relic);
        });
        rogueVariationArr[i] = Object.keys(theme.value.variationDict).map(key => {
            const variation = theme.value.variationDict[key];
            return createDoc(oldVariationDocs[i], [variation.id, variation.outerName], variation);
        });
    });

    const dataArr = filterDocuments(oldDocuments, rogueArr);
    const stageDataArr = rogueStageArr.map((stageArr, i) => filterDocuments(oldStageDocs[i], stageArr));
    const toughDataArr = rogueToughArr.map((toughArr, i) => filterDocuments(oldToughDocs[i], toughArr));
    const relicDataArr = rogueRelicArr.map((relicArr, i) => filterDocuments(oldRelicDocs[i], relicArr));
    const variationDataArr = rogueVariationArr.map((variationArr, i) => filterDocuments(oldVariationDocs[i], variationArr));

    for (const datum of dataArr) {
        try {
            T.RogueThemeZod.parse(datum.value);
        } catch (e: any) {
            G.log('\nRogue theme type conformity error: ' + datum.keys);
            G.log(e);
            break;
        }
    }

    await updateDb(collection[0], dataArr);
    for (let i = 0; i < numOfThemes; i++) {
        await updateDb(`${collection[1]}/${i}`, stageDataArr[i]);
        await updateDb(`${collection[2]}/${i}`, toughDataArr[i]);
        await updateDb(`${collection[3]}/${i}`, relicDataArr[i]);
        await updateDb(`${collection[4]}/${i}`, variationDataArr[i]);
    }
    console.log(`${dataArr.length} Rogue themes loaded in ${(Date.now() - start) / 1000}s`);
    for (let i = 0; i < stageDataArr.length; i++) {
        if (stageDataArr[i].length === 0) continue;
        console.log(`${stageDataArr[i].length} Rogue ${i} stages loaded in ${(Date.now() - start) / 1000}s`);
    }
    for (let i = 0; i < toughDataArr.length; i++) {
        if (toughDataArr[i].length === 0) continue;
        console.log(`${toughDataArr[i].length} Rogue ${i} tough stages loaded in ${(Date.now() - start) / 1000}s`);
    }
    for (let i = 0; i < relicDataArr.length; i++) {
        if (relicDataArr[i].length === 0) continue;
        console.log(`${relicDataArr[i].length} Rogue ${i} relics loaded in ${(Date.now() - start) / 1000}s`);
    }
    for (let i = 0; i < variationDataArr.length; i++) {
        if (variationDataArr[i].length === 0) continue;
        console.log(`${variationDataArr[i].length} Rogue ${i} variations loaded in ${(Date.now() - start) / 1000}s`);
    }
}
async function loadSandboxes() {
    /*
    Canonical key: index
    Additional keys: none
    */

    const start = Date.now();
    const collection = ["sandbox", "sandbox/stage", "sandbox/item", "sandbox/weather"];
    const oldDocuments = await getCollectionMetaInfo(collection[0]);
    const oldStageDocs: any[] = [];
    const oldItemDocs: any[] = [];
    const oldWeatherDocs: any[] = [];

    const sandboxTable = await fetchData('excel/sandbox_perm_table.json');
    const basicInfo: { [key: string]: any } = sandboxTable.basicInfo;
    const SANDBOX_V2: { [key: string]: any } = sandboxTable.detail.SANDBOX_V2;

    const numOfThemes = Object.keys(basicInfo).length;

    for (let i = 0; i < numOfThemes; i++) {
        oldStageDocs.push(await getCollectionMetaInfo(`${collection[1]}/${i}`));
        oldItemDocs.push(await getCollectionMetaInfo(`${collection[2]}/${i}`));
        oldWeatherDocs.push(await getCollectionMetaInfo(`${collection[3]}/${i}`));
    }

    const sandArr: Doc[] = [];
    for (let i = 0; i < numOfThemes; i++) {
        const sandbox = Object.values(SANDBOX_V2)[i];
        const name = Object.values(basicInfo)[i].topicName;
        // const rewardConfigData: { [key: string]: any } = sandbox.rewardConfigData; // stage/enemy/minable/other drops

        const stageDict = {};
        const stageData: { [key: string]: any } = sandbox.stageData;
        for (const excel of Object.values(stageData)) {
            const levels = await fetchData(`levels/${excel.levelId.toLowerCase()}.json`);
            stageDict[excel.stageId.toLowerCase()] = { excel, levels };
        }
        const itemData: { [key: string]: any } = sandboxTable.itemData;
        const itemDict = {};
        for (const item of Object.values(itemData)) {
            const itemId = item.itemId.toLowerCase();
            itemDict[itemId] = {
                craft: sandbox.craftItemData[itemId] ?? null,
                drink: sandbox.drinkMatData[itemId] ?? null,
                foodMat: sandbox.foodMatData[itemId] ?? null,
                food: sandbox.foodData[itemId] ?? null,
                data: item
            };
        }
        const weatherDict: { [key: string]: any } = sandbox.weatherData;

        sandArr[i] = createDoc(oldDocuments, [i.toString()], { name, stageDict, itemDict, weatherDict });
    }

    const sandStageArr: Doc[][] = [];
    const sandItemArr: Doc[][] = [];
    const sandWeatherArr: Doc[][] = [];
    sandArr.forEach((theme, i) => {
        sandStageArr[i] = Object.keys(theme.value.stageDict).map(key => {
            const stage = theme.value.stageDict[key];
            return createDoc(oldStageDocs[i], [stage.excel.stageId, stage.excel.name, stage.excel.code], stage);
        });
        sandItemArr[i] = Object.keys(theme.value.itemDict).map(key => {
            const item = theme.value.itemDict[key];
            return createDoc(oldItemDocs[i], [item.data.itemId, item.data.itemName], item);
        });
        sandWeatherArr[i] = Object.keys(theme.value.weatherDict).map(key => {
            const weather = theme.value.weatherDict[key];
            return createDoc(oldWeatherDocs[i], [weather.weatherId, weather.name], weather);
        });
    });

    const dataArr = filterDocuments(oldDocuments, sandArr);
    const stageDataArr = sandStageArr.map((stageArr, i) => filterDocuments(oldStageDocs[i], stageArr));
    const itemDataArr = sandItemArr.map((itemArr, i) => filterDocuments(oldItemDocs[i], itemArr));
    const weatherDataArr = sandWeatherArr.map((weatherArr, i) => filterDocuments(oldWeatherDocs[i], weatherArr));

    for (const datum of dataArr) {
        try {
            T.SandboxActZod.parse(datum.value);
        } catch (e: any) {
            G.log('\nSandbox act type conformity error: ' + datum.keys);
            G.log(e);
            break;
        }
    }

    await updateDb(collection[0], dataArr);
    for (let i = 0; i < numOfThemes; i++) {
        await updateDb(`${collection[1]}/${i}`, stageDataArr[i]);
        await updateDb(`${collection[2]}/${i}`, itemDataArr[i]);
        await updateDb(`${collection[3]}/${i}`, weatherDataArr[i]);
    }
    console.log(`${dataArr.length} Sandbox acts loaded in ${(Date.now() - start) / 1000}s`);
    for (let i = 0; i < stageDataArr.length; i++) {
        if (stageDataArr[i].length === 0) continue;
        console.log(`${stageDataArr[i].length} Sandbox ${i} stages loaded in ${(Date.now() - start) / 1000}s`);
    }
    for (let i = 0; i < itemDataArr.length; i++) {
        if (itemDataArr[i].length === 0) continue;
        console.log(`${itemDataArr[i].length} Sandbox ${i} items loaded in ${(Date.now() - start) / 1000}s`);
    }
    for (let i = 0; i < weatherDataArr.length; i++) {
        if (weatherDataArr[i].length === 0) continue;
        console.log(`${weatherDataArr[i].length} Sandbox ${i} weathers loaded in ${(Date.now() - start) / 1000}s`);
    }

}
async function loadSandbox0() {
    /*
    Canonical key: index
    Additional keys: none
    */

    const start = Date.now();
    const collection = "sandbox";
    const oldDocuments = await getCollectionMetaInfo(collection);

    const sandboxTable = await fetchData('excel/sandbox_table.json');
    const sandboxActTables: { [key: string]: any } = sandboxTable.sandboxActTables;

    const sandArr: Doc[] = [];
    for (let i = 0; i < Object.keys(sandboxActTables).length; i++) {
        const sandboxAct = Object.values(sandboxActTables)[i];
        const stageDatas: { [key: string]: any } = sandboxAct.stageDatas;
        const stageDict = {};

        for (const excel of Object.values(stageDatas)) {
            const levelId = excel.levelId.toLowerCase();
            const stageName = excel.name.toLowerCase();
            const levels = await fetchData(`levels/${levelId}.json`);
            stageDict[stageName] = { excel, levels };
        }

        sandArr[i] = createDoc(oldDocuments, [i.toString()], { stageDict: stageDict });
    }

    const dataArr = filterDocuments(oldDocuments, sandArr);

    for (const datum of dataArr) {
        try {
            T.SandboxActZod.parse(datum.value);
        } catch (e: any) {
            G.log('\nSandbox act type conformity error: ' + datum.keys);
            G.log(e);
            break;
        }
    }

    await updateDb(collection, dataArr);
    console.log(`${dataArr.length} Sandbox acts loaded in ${(Date.now() - start) / 1000}s`);
}
async function loadSkills() {
    await loadGeneric('skill',
        async () => {
            const collection = "skill";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const characterTable: { [key: string]: any } = await fetchData('excel/character_table.json');
            const skillTable: { [key: string]: any } = await fetchData('excel/skill_table.json');

            const dataArr = filterDocuments(oldDocuments,
                Object.values(skillTable).map(excel => {
                    const deploySkill = Object.values(characterTable)
                        .flatMap(deploy => deploy.skills)
                        .find(skill => skill?.skillId === excel.skillId) ?? null;
                    const skill = { deploy: deploySkill, excel: excel };
                    G.skillDict[excel.skillId.toLowerCase()] = skill;
                    return createDoc(oldDocuments, [excel.skillId], skill);
                })
            );

            for (const datum of dataArr) {
                try {
                    T.SkillZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nSkill type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadSkins() {
    await loadGeneric('skin',
        async () => {
            const collection = "skin";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const skinTable = await fetchData('excel/skin_table.json');
            const charSkins: { [key: string]: any } = skinTable.charSkins;

            const skinArr: Doc[] = [];
            for (const skin of Object.values(charSkins)) {
                const charId = skin.tmplId ?? skin.charId
                if (!G.skinArrDict.hasOwnProperty(charId)) {
                    G.skinArrDict[charId] = [];
                }
                G.skinArrDict[charId].push(skin);
                G.skinDict[skin.skinId] = skin;

                skinArr.push(createDoc(oldDocuments, [skin.skinId], skin));
            }

            const dataArr = filterDocuments(oldDocuments, skinArr);

            for (const datum of dataArr) {
                try {
                    T.SkinZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nSkin type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadStages() {
    /*
    Single stage:
        Canonical key: stageId
        Additional keys: code, name
    Stage array:
        Canonical key: code
        Additional keys: none
    */

    const start = Date.now();
    const collection = ["stage", "toughstage"];
    const oldStageDocs = await getCollectionMetaInfo(collection[0]);
    const oldToughDocs = await getCollectionMetaInfo(collection[1]);

    const stageTable = await fetchData('excel/stage_table.json');
    const stages: { [key: string]: any } = stageTable.stages;

    const stageArr: Doc[] = [];
    const toughArr: Doc[] = [];

    const stageEntries = Object.values(stages).filter(excel => {
        // Skip story and cutscene levels
        if (excel.isStoryOnly || excel.stageType === 'GUIDE') return false;

        const levelId = excel.levelId.toLowerCase();
        // Skip easy levels cause no one cares, basically the same as normal anyways
        if (levelId.includes('easy_sub') || levelId.includes('easy')) return false;
        // Skip SSS challenge levels cause the only thing that changes is the starting danger level
        if (excel.stageType === 'CLIMB_TOWER' && levelId.endsWith('_ex')) return false;
        return true;
    });

    await processWithConcurrencyLimit(stageEntries, 4, async (excel) => {
        // Il Siracusano (act21side) levels have _m and _t variants
        // _t variants have their own level file in a separate 'mission' folder, but _m variants share data with normal levels
        // Check for if level is a _m variant, if so get the right level file
        const levelRegex = /\S+_m$/;
        let levelId = excel.levelId.toLowerCase();
        if (levelId.match(levelRegex)) {
            levelId = levelId.substring(0, excel.levelId.length - 2).split('mission/').join('');
        }

        const code = excel.code.toLowerCase();

        if (excel.diffGroup === 'TOUGH' || excel.difficulty === 'FOUR_STAR') {
            if (!toughArr.find(data => data.keys.includes(code))) {
                toughArr.push(createDoc(oldToughDocs, [code], []));
            }

            try {
                const levels = await fetchData(`levels/${levelId}.json`);
                const stage = { excel: excel, levels: levels };

                toughArr.push(createDoc(oldToughDocs, [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], [stage]));
                toughArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
            catch (e) {
                const levels = await (await fetch(`${G.backupPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                toughArr.push(createDoc(oldToughDocs, [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], [stage]));
                toughArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
        }
        else if (excel.difficulty === 'NORMAL') {
            if (!stageArr.find(data => data.keys.includes(code))) {
                stageArr.push(createDoc(oldStageDocs, [code], [])); // Multiple stages can have the same code, so each code maps to an array
            }

            try {
                const levels = await fetchData(`levels/${levelId}.json`);
                const stage = { excel: excel, levels: levels };

                stageArr.push(createDoc(oldStageDocs, [excel.stageId, excel.code, excel.name], [stage]));
                stageArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
            catch (e) {
                const levels = await (await fetch(`${G.backupPath}/levels/${levelId}.json`)).json();
                const stage = { excel: excel, levels: levels };

                stageArr.push(createDoc(oldStageDocs, [excel.stageId, excel.code, excel.name], [stage]));
                stageArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            }
        }
    });

    const dataArr = filterDocuments(oldStageDocs, stageArr);
    const toughDataArr = filterDocuments(oldToughDocs, toughArr);

    for (const datumArr of dataArr) {
        for (const datum of datumArr.value) {
            try {
                T.StageZod.parse(datum);
            } catch (e: any) {
                G.log('\nStage type conformity error: ' + datumArr.keys);
                G.log(e);
                break;
            }
        }
    }
    for (const datumArr of toughDataArr) {
        for (const datum of datumArr.value) {
            try {
                T.StageZod.parse(datum);
            } catch (e: any) {
                G.log('\nTough stage type conformity error: ' + datum.keys);
                G.log(e);
                break;
            }
        }
    }

    await updateDb("stage", dataArr);
    await updateDb("toughstage", toughDataArr);
    console.log(`${dataArr.length} Stages loaded in ${(Date.now() - start) / 1000}s`);
    console.log(`${toughDataArr.length} Tough stages loaded in ${(Date.now() - start) / 1000}s`);
}

async function loadCnArchetypes() {
    await loadGeneric('cn/archetype',
        async () => {
            const collection = "cn/archetype";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const moduleTable = await fetchCnData('excel/uniequip_table.json');
            const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

            const dataArr = filterDocuments(oldDocuments,
                Object.values(subProfDict)
                    .filter(subProf => !G.archetypeDict.hasOwnProperty(subProf.subProfessionId))
                    .map(subProf => {
                        G.cnarchetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
                        return createDoc(oldDocuments, [subProf.subProfessionId], subProf.subProfessionName);
                    })
            );

            return dataArr;
        });
}
async function loadCnBases() {
    await loadGeneric('cn/base',
        async () => {
            const collection = "cn/base";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const buildingData = await fetchCnData('excel/building_data.json');
            const buffs: { [key: string]: any } = buildingData.buffs;

            const dataArr = filterDocuments(oldDocuments,
                Object.values(buffs)
                    .filter(buff => !G.baseDict.hasOwnProperty(buff.buffId))
                    .map(buff => {
                        G.cnbaseDict[buff.buffId] = buff;
                        return createDoc(oldDocuments, [buff.buffId], buff);
                    })
            );

            for (const datum of dataArr) {
                try {
                    T.BaseZod.parse(datum.value);
                } catch (e: any) {
                    G.log('\nBase type conformity error: ' + datum.keys);
                    G.log(e);
                    break;
                }
            }

            return dataArr;
        });
}
async function loadCnModules() {
    await loadGeneric('cn/module',
        async () => {
            const collection = "cn/module";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const moduleTable = await fetchCnData('excel/uniequip_table.json');
            const equipDict: { [key: string]: any } = moduleTable.equipDict;
            const battleDict: { [key: string]: any } = await fetchCnData('excel/battle_equip_table.json');

            const dataArr = filterDocuments(oldDocuments,
                Object.values(equipDict)
                    .filter(module => !G.moduleDict.hasOwnProperty(module.uniEquipId))
                    .map(module => {
                        G.cnmoduleDict[module.uniEquipId] = { info: module, data: battleDict[module.uniEquipId] ?? null };
                        return createDoc(oldDocuments, [module.uniEquipId], { info: module, data: battleDict[module.uniEquipId] ?? null });
                    })
            );

            return dataArr;
        });
}
async function loadCnOperators() {
    await loadGeneric('cn/operator',
        async () => {
            const collection = "cn/operator";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const operatorTable = await fetchCnData('excel/character_table.json');
            const patchChars = (await fetchCnData('excel/char_patch_table.json')).patchChars;
            const charEquip = (await fetchCnData('excel/uniequip_table.json')).charEquip;
            const charBaseBuffs = (await fetchCnData('excel/building_data.json')).chars;

            const opArr: Doc[] = [];
            for (const opId of Object.keys(operatorTable)) {
                if (G.operatorDict.hasOwnProperty(opId)) continue;
                opArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs, oldDocuments));
            }
            for (const opId of Object.keys(patchChars)) {
                if (G.operatorDict.hasOwnProperty(opId)) continue;
                opArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs, oldDocuments));
            }

            const dataArr = filterDocuments(oldDocuments, opArr);

            return dataArr;
        });
}
async function loadCnParadoxes() {
    await loadGeneric('cn/paradox',
        async () => {
            const collection = "cn/paradox";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const handbookTable = await fetchCnData('excel/handbook_info_table.json');
            const stages: { [key: string]: any } = handbookTable.handbookStageData;

            const dataArr = filterDocuments(oldDocuments,
                await Promise.all(Object.values(stages)
                    .filter(excel => !G.paradoxDict.hasOwnProperty(excel.charId))
                    .map(async excel => {
                        const levels = await (await (fetch(`${G.cnDataPath}/levels/${excel.levelId.toLowerCase()}.json`))).json();
                        G.cnparadoxDict[excel.charId] = { excel: excel, levels: levels };
                        return createDoc(oldDocuments, [excel.charId, excel.stageId], { excel: excel, levels: levels });
                    })
                )
            );

            return dataArr;
        });
}
async function loadCnRanges() {
    await loadGeneric('cn/range',
        async () => {
            const collection = "cn/range";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const rangeTable: { [key: string]: any } = await fetchCnData('excel/range_table.json');

            const dataArr = filterDocuments(oldDocuments,
                Object.values(rangeTable)
                    .filter(range => !G.rangeDict.hasOwnProperty(range.id))
                    .map(range => {
                        G.cnrangeDict[range.id] = range;
                        return createDoc(oldDocuments, [range.id], range);
                    })
            );

            return dataArr;
        });
}
async function loadCnSkills() {
    await loadGeneric('cn/skill',
        async () => {
            const collection = "cn/skill";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const skillTable: { [key: string]: any } = await fetchCnData('excel/skill_table.json');

            const dataArr = filterDocuments(oldDocuments,
                Object.values(skillTable)
                    .filter(skill => !G.skillDict.hasOwnProperty(skill.skillId.toLowerCase()))
                    .map(skill => {
                        G.cnskillDict[skill.skillId.toLowerCase()] = skill;
                        return createDoc(oldDocuments, [skill.skillId], skill);
                    })
            );

            return dataArr;
        });
}
async function loadCnSkins() {
    await loadGeneric('cn/skin',
        async () => {
            const collection = "cn/skin";
            const oldDocuments = await getCollectionMetaInfo(collection);

            const skinTable = await fetchCnData('excel/skin_table.json');
            const charSkins: { [key: string]: any } = skinTable.charSkins;

            const skinArr: Doc[] = [];
            for (const skin of Object.values(charSkins)) {
                if (G.skinDict.hasOwnProperty(skin.skinId)) continue;

                if (!G.cnskinArrDict.hasOwnProperty(skin.charId)) {
                    G.cnskinArrDict[skin.charId] = []; // Create an empty array if it's the first skin for that op
                }
                G.cnskinArrDict[skin.charId].push(skin);

                skinArr.push(createDoc(oldDocuments, [skin.skinId], skin));
            }

            const dataArr = filterDocuments(oldDocuments, skinArr);

            return dataArr;
        });
}

main();
