import { exec } from 'child_process';
import commandLineArgs from 'command-line-args';
import 'dotenv/config';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as T from "hella-types";
import { Db, ObjectId } from 'mongodb';
import { normalize } from 'path';
import simpleGit from 'simple-git';
import { promisify } from 'util';
import * as zod from 'zod';
import getDb from "../src/db";
const objectHash = require('object-hash');

const logDate = (msg: string) => console.log(`[${new Date().toLocaleString()}] ${msg}`);
const logTime = (msg: string) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
const log = (msg: string) => console.log(msg);
const execWait = promisify(exec);

class G {
    static optionDefinitions = [
        { name: 'ci', type: Boolean, defaultValue: false },
        { name: 'gamedata_path', alias: 'g', type: String, defaultValue: 'HellaAssets/gamedata' },
        { name: 'collections', alias: 'c', type: String, multiple: true },
        { name: 'allgacha', type: Boolean, defaultValue: false },
    ];
    static options = commandLineArgs(G.optionDefinitions);

    static collectionDeps = {
        'cn': ['operator'],
        'deployable': ['archetype', 'range', 'skill', 'skin'],
        'operator': ['base', 'module', 'paradox', 'deployable'],
        'recruit': ['operator'],
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
        ccb: true,
        ccblegacy: true,
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

    static archetypeDict: { [key: string]: string } = {};
    static baseDict: { [key: string]: T.Base } = {};
    static deployDict: { [key: string]: T.Deployable } = {};
    static moduleDict: { [key: string]: T.Module } = {};
    static operatorDict: { [key: string]: T.Operator } = {};
    static paradoxDict: { [key: string]: T.Paradox } = {};
    static rangeDict: { [key: string]: T.GridRange } = {};
    static skillDict: { [key: string]: T.Skill } = {};
    static skinArrDict: { [key: string]: T.Skin[] } = {};
    static skinDict: { [key: string]: T.Skin } = {};
    static cnarchetypeDict: { [key: string]: string } = {};
    static cnbaseDict: { [key: string]: T.Base } = {};
    static cnmoduleDict: { [key: string]: T.Module } = {};
    static cnparadoxDict: { [key: string]: T.Paradox } = {};
    static cnrangeDict: { [key: string]: T.GridRange } = {};
    static cnskillDict: { [key: string]: T.Skill } = {};
    static cnskinArrDict: { [key: string]: T.Skin[] } = {};

    static backupGamedataUrls = [
        'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata',
        'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/5ba509ad5a07f17b7e220a25f1ff66794dd79af1/en_US/gamedata' // last commit before removing en_US folder
    ];
    static cnGamedataUrl = 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata';
    static gameConsts = (require('../src/constants.json')).gameConsts;

    static db: Db;
    static index: number;
    static hash: string;
    static message: string;
    static date: number;
    static hasUpdates = false;
}

type PreDoc = {
    keys: string[],
    value: any
};
type Doc = {
    _id?: ObjectId,
    meta: {
        createdIndex: number,
        updatedIndex: number,
        hash: string,
        created: string,
        updated: string,
        date: number,
    },
    canon: string,
    keys: string[],
    value: any
}

async function main() {
    if (G.options.collections) {
        const recurse = (coll: string) => {
            if (G.collectionsToLoad.hasOwnProperty(coll))
                G.collectionsToLoad[coll] = true;
            G.collectionDeps[coll]?.forEach(dep => recurse(dep));
        }
        Object.keys(G.collectionsToLoad).forEach(coll => G.collectionsToLoad[coll] = false);
        G.options.collections.forEach((coll: string) => recurse(coll));
    }

    G.db = await getDb();
    if (!G.db)
        return console.error('Failed to connect to database');
    const about = await G.db.collection('about').findOne({});
    const latest = (await simpleGit(G.options.gamedata_path).log()).latest;
    G.hash = latest.hash;
    G.message = latest.message;
    G.date = Math.round(Date.now() / 1000); // seconds since unix epoch
    G.index = (about?.index ?? 0) + 1;

    logDate('Starting DB load');
    logDate('CI mode: ' + (G.options.ci ? 'ON' : 'OFF'));
    logDate(`Commit: ${G.hash} - ${G.message}`);
    logDate(`Gamedata path: ${G.options.gamedata_path}`);
    logDate(`Collections to load: ${Object.entries(G.collectionsToLoad).filter(([_, v]) => v).map(([k, _]) => k).join(', ')}`); // copilot fuckery

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

    if (G.options.ci) {
        logTime(G.hasUpdates ? `about: updates were found, incrementing DB index to ${G.index}` : 'about: no updates were found');
        await G.db.collection('about').updateOne({}, {
            $set: {
                date: G.date,
                index: G.hasUpdates ? G.index : G.index - 1,
                hash: G.hash,
                message: G.message
            }
        }, { upsert: true });
    }

    logDate('Finished DB load');
    process.exit(0);
}

async function fetchCnData(path: string): Promise<any> {
    const retries = 3;
    let attempt = 0;
    while (attempt < retries) {
        try {
            const res = await fetch(`${G.cnGamedataUrl}/${path}`);
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
                log(`Error loading ${path}: ${(err as Error).message}`);
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
            const filePath = normalize(`${G.options.gamedata_path}/${path}`.replace(/\\/g, '/'));
            if (existsSync(filePath)) {
                const content = readFileSync(filePath, 'utf8');
                return JSON.parse(content);
            }
            for (const url of G.backupGamedataUrls) {
                const res = await fetch(`${url}/${path}`);
                if (res.ok) {
                    return await res.json();
                }
                if (res.status === 429) {
                    await new Promise(resolve => setTimeout(resolve, 5000 * ++attempt));
                    continue;
                }
            }
        } catch (err) {
            attempt++;
            if (attempt >= retries) {
                log(`Error loading ${path}: ${(err as Error).message}`);
                throw err;
            }
        }
    }
    throw new Error(`File not found locally or at backup URLs: ${path}`);
}
function readOperatorIntoArr(opId: string, charFile, charEquip, charBaseBuffs) {
    const arr: PreDoc[] = [];

    if (['char_512_aprot'].includes(opId)) return []; // why are there two shalems???
    if (!opId.startsWith('char_')) return [];

    // ID AND DATA
    const opData = charFile[opId];
    if (['notchar1', 'notchar2'].includes(opData.subProfessionId)) return [];

    const nameOverride = {
        'char_614_acsupo': 'Raidian (Stronghold Protocol)',
        'char_002_amiya': 'Amiya (Caster)',
        'char_1001_amiya2': 'Amiya (Guard)',
        'char_1037_amiya3': 'Amiya (Medic)',
    };
    if (nameOverride[opId]) opData.name = nameOverride[opId];

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

    // KEYS
    const opName = opData.name.toLowerCase();
    const nameDeleteCharRegex = /['-()]/g;
    const keyArr: string[] = [opId, opName, opName.replace(nameDeleteCharRegex, ''), opName.replace(nameDeleteCharRegex, ' ')];
    keyArr.push(...keyArr.slice(1).filter(k => k.includes(' the ')).map(k => k.split(' the ')[0] + ' alter'));

    // Deaccented names and alts without "the" in their names
    const hardcodeOpId = {
        'char_4055_bgsnow': ['pozemka'],
        'char_4064_mlynar': ['mlynar'],
        'char_002_amiya': ['caster amiya', 'amiya caster'],
        'char_1001_amiya2': ['guard amiya', 'amiya guard'],
        'char_1037_amiya3': ['medic amiya', 'amiya medic'],
        'char_1029_yato2': ['yato alter'],
        'char_1030_noirc2': ['noir corne alter'],
        'char_1016_agoat2': ['eyjafyalla the hvit aska'],
        'char_1035_wisdel': ['wisadel', 'w alter'],
        'char_1019_siege2': ['siege alter'],
        'char_1042_phatm2': ['phantom alter'],
    }
    if (hardcodeOpId[opId]) keyArr.push(...hardcodeOpId[opId]);

    arr.push({
        keys: keyArr,
        value: {
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
    });

    return arr;
}
async function loadCollection(collection: string, dataArr: PreDoc[], schema: zod.ZodObject<any> | zod.ZodArray<any> | null) {
    const createDoc = (oldDocuments: any[], keys: string[], value: any): Doc => {
        const oldDoc = oldDocuments.find(doc => doc.canon === keys[0]);
        const createdIndex = oldDoc ? (oldDoc.meta?.createdIndex ?? 0) : undefined;
        const createdHash = oldDoc ? (oldDoc?.meta?.created ?? '0'.repeat(40)) : undefined;
        return {
            meta: {
                createdIndex: createdIndex ?? G.index,
                updatedIndex: G.index,
                hash: objectHash(
                    {
                        keys: keys.map(key => key.toLowerCase()),
                        value: value
                    },
                    { respectType: false }
                ),
                created: createdHash ?? G.hash,
                updated: G.hash,
                date: G.date,
            },
            canon: keys[0],
            keys: keys.map(key => key.toLowerCase()),
            value: value
        }
    }
    const filterDocs = (oldDocs: any[], newDoc: Doc) => {
        const oldDoc = oldDocs.find(old => old.canon === newDoc.canon);
        const docsAreEqual = oldDoc && oldDoc.meta.hash === newDoc.meta.hash;
        return !docsAreEqual;
    }

    const oldDocs = await G.db.collection(collection).find({}, { projection: { 'value': 0 } }).toArray();
    logTime(`${collection}: found ${dataArr.length}/${oldDocs.length}`);
    const newDocs = dataArr
        .map(newDoc => createDoc(oldDocs, newDoc.keys, newDoc.value))
        .filter(doc => filterDocs(oldDocs, doc));

    const schemaErrors = [];
    if (newDocs.length !== 0) {
        G.hasUpdates = true;

        let validate = true;
        if (schema) {
            for (const doc of newDocs) {
                try {
                    schema.parse(doc.value);
                } catch (e: any) {
                    validate = false;
                    schemaErrors.push({ key: doc.canon, error: e.errors });
                    break;
                }
            }
        }
        if (!validate) {
            const cleanCollection = collection.replaceAll('/', '_');
            writeFileSync(`schema_${cleanCollection}.log`, JSON.stringify(schemaErrors, null, 2));
            logTime(`${collection}: wrote schema validation errors to schema_${cleanCollection}.log`);
        } else {
            logTime(`${collection}: schema validated`);
        }

        logTime(`${collection}: found ${newDocs.filter(doc => !oldDocs.some(old => old.canon === doc.canon)).length} new docs`);
        logTime(`${collection}: found ${newDocs.filter(doc => oldDocs.some(old => old.canon === doc.canon)).length}/${oldDocs.length} updated docs`);

        const unique = new Set();
        for (const datum of newDocs) {
            if (unique.has(datum.canon)) {
                log(`Duplicate canon in ${collection}: ${datum.canon}`);
                continue;
            }
            unique.add(datum.canon);
        }

        if (G.options.ci) {
            logTime(`${collection}: writing ${newDocs.length} documents`);
            const filter = { canon: { $in: newDocs.map(datum => datum.canon) } };
            await G.db.collection(collection).deleteMany(filter);
            await G.db.collection(collection).insertMany(newDocs);
        }
        else {
            logTime(`${collection}: would have written ${newDocs.length} documents`);
        }
    }

    logTime(`${collection}: finished`);
}

async function loadArchetypes() {
    const collection = 'archetype';
    logTime(`${collection}: starting`);

    const moduleTable = await fetchData('excel/uniequip_table.json');
    const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

    const dataArr: PreDoc[] = Object.values(subProfDict)
        .map(subProf => {
            G.archetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
            return { keys: [subProf.subProfessionId], value: subProf.subProfessionName };
        })

    await loadCollection(collection, dataArr, null);
}
async function loadBases() {
    const collection = 'base';
    logTime(`${collection}: starting`);

    const buildingData = await fetchData('excel/building_data.json');
    const buffs: { [key: string]: any } = buildingData.buffs;

    const dataArr: PreDoc[] = Object.values(buffs)
        .map(buff => {
            G.baseDict[buff.buffId] = buff;
            return { keys: [buff.buffId], value: buff };
        });

    await loadCollection(collection, dataArr, T.BaseZod);
}
async function loadCC() {
    const collection = 'cc';
    logTime(`${collection}: starting`);

    const ccStages = G.gameConsts.ccStages;

    const dataArr: PreDoc[] = await Promise.all(ccStages.map(async stage => {
        const levels = await fetchData(`levels/${stage.levelId}.json`);
        return { keys: [stage.levelId.split('/')[stage.levelId.split('/').length - 1], stage.name], value: { const: stage, levels: levels } };
    }));

    await loadCollection(collection, dataArr, T.CCStageZod);
}
async function loadCCB() {
    const collection = ["ccb", "ccb/stage"];
    logTime(`${collection[0]}, ${collection[1]}: starting`);

    const crisisDetails: any = JSON.parse((await execWait('python3 scripts/crisisv2.py')).stdout);

    if (!crisisDetails || !crisisDetails.info)
        return logTime(`${collection[0]}, ${collection[1]}: no crisisv2 data was found`)
    if (!crisisDetails.info.seasonId)
        return logTime(`${collection[0]}, ${collection[1]}: no current seasonId was found`)

    const mapStageDataMap: { [key: string]: any } = crisisDetails.info.mapStageDataMap;
    const stageDict: { [key: string]: any } = {};
    for (const stage of Object.values(mapStageDataMap)) {
        const levels = await fetchData(`levels/${stage.levelId.toLowerCase()}.json`);
        stageDict[stage.stageId] = { excel: stage, levels: levels };
    }

    const dataArr: PreDoc[] = [{ keys: [crisisDetails.info.seasonId], value: { seasonId: crisisDetails.info.seasonId, stageDict: stageDict } }];
    const stageArr: PreDoc[] = Object.values(stageDict).map(stage => { return { keys: [stage.excel.stageId, stage.excel.name, stage.excel.code], value: stage } });

    await loadCollection(collection[0], dataArr, T.CCSeasonZod);
    await loadCollection(collection[1], stageArr, T.CCStageZod);
}
async function loadCCBLegacy() {
    const collection = 'ccb/legacy';
    logTime(`${collection}: starting`);

    const ccbStages = G.gameConsts.ccbStages; // legacy, manually collected data

    const dataArr: PreDoc[] = await Promise.all(ccbStages.map(async stage => {
        const levels = await fetchData(`levels/${stage.levelId}.json`);
        return { keys: [stage.levelId.split('/')[stage.levelId.split('/').length - 1], stage.name], value: { const: stage, levels: levels } };
    }));

    await loadCollection(collection, dataArr, T.CCStageLegacyZod);
}
async function loadDefinitions() {
    const collection = 'define';
    logTime(`${collection}: starting`);

    const gamedataConst = await fetchData('excel/gamedata_const.json');
    const termDescriptionDict: { [key: string]: any } = gamedataConst.termDescriptionDict;

    const dataArr: PreDoc[] = Object.values(termDescriptionDict).map(definition => {
        return { keys: [definition.termId, definition.termName], value: definition }
    });

    await loadCollection(collection, dataArr, T.DefinitionZod);
}
async function loadDeployables() {
    const collection = 'deployable';
    logTime(`${collection}: starting`);

    const characterTable: { [key: string]: any } = await fetchData('excel/character_table.json');

    const dataArr: PreDoc[] = Object.keys(characterTable)
        .filter(key => ['TRAP', 'TOKEN'].includes(characterTable[key].profession))
        .map(key => {
            const data = characterTable[key];
            return {
                keys: [key, data.name, data.name.replace(/['-]/g, '')],
                value: {
                    id: key,
                    archetype: G.archetypeDict[data.subProfessionId] ?? G.cnarchetypeDict[data.subProfessionId],
                    data: data,
                    range: G.rangeDict[data.phases[data.phases.length - 1].rangeId]
                        ?? G.cnrangeDict[data.phases[data.phases.length - 1]]
                        ?? null,
                    skills: data.skills.map(s => G.skillDict[s.skillId] ?? G.cnskillDict[s.skillId] ?? null),
                    skins: G.skinArrDict[key] ?? G.cnskinArrDict[key] ?? []
                }
            }
        });

    await loadCollection(collection, dataArr, T.DeployableZod);
}
async function loadEnemies() {
    const collection = 'enemy';
    logTime(`${collection}: starting`);

    // Find matches between enemy_handbook_table and enemy_database
    //         // Stores data in enemyDict[enemy] = {excel, levels}
    //         //     excel = /excel/enemy_handbook_table.json
    //         //         Contains name, ID, category, description
    //         //     levels = /levels/enemydata/enemy_database.json
    //         //         Contains stats, skills, range
    //         // Unique enemy key is enemyId (enemy_1007_slime)
    //         // Additional keys are name (originium slug) and enemyIndex (b1) 
    const enemyHandbook = await fetchData('excel/enemy_handbook_table.json');
    const enemyDatabase = await fetchData('levels/enemydata/enemy_database.json');
    const enemyData: { [key: string]: any } = enemyHandbook.enemyData;

    const levelsLookup = {};
    for (const levels of enemyDatabase.enemies) {
        levelsLookup[levels.Key] = levels;
    }

    const dataArr: PreDoc[] = Object.values(enemyData).map(excel => {
        return { keys: [excel.enemyId, excel.name, excel.name.split('\'').join(''), excel.enemyIndex], value: { excel: excel, levels: levelsLookup[excel.enemyId] } }
    });

    await loadCollection(collection, dataArr, T.EnemyZod);

}
async function loadEvents() {
    const collection = 'event';
    logTime(`${collection}: starting`);

    const activityTable = await fetchData('excel/activity_table.json');
    const basicInfo: { [key: string]: any } = activityTable.basicInfo;

    const dataArr: PreDoc[] = Object.values(basicInfo).map(event => {
        return { keys: [event.id], value: event }
    });

    await loadCollection(collection, dataArr, T.GameEventZod);
}
async function loadGacha() {
    const collection = "gacha";
    logTime(`${collection}: starting`);

    const gachaTable = await fetchData('excel/gacha_table.json');
    const gachaPoolClient: any[] = gachaTable.gachaPoolClient.sort((a, b) => b.openTime - a.openTime);

    const dataArr: PreDoc[] = [];
    if (G.options.allgacha) {
        // batch into groups of 50 to avoid hitting shell length limit
        for (let i = 0; i < Math.ceil(gachaPoolClient.length / 50); i++) {
            const gachaPools = gachaPoolClient.slice(i * 50, (i + 1) * 50);
            const poolDetails: any[] = JSON.parse((await execWait(`python3 scripts/gacha.py ${gachaPools.map(pool => pool.gachaPoolId).join(' ')}`)).stdout);

            gachaPools.forEach((pool, i) => {
                dataArr.push({ keys: [pool.gachaPoolId], value: { client: pool, details: poolDetails[i] } });
            })
        }
    }
    else {
        // only get 12 most recent pools to minimize official api calls
        const gachaPools = gachaPoolClient.slice(0, 12);
        const poolDetails: any[] = JSON.parse((await execWait(`python3 scripts/gacha.py ${gachaPools.map(pool => pool.gachaPoolId).join(' ')}`)).stdout);

        gachaPools.forEach((pool, i) => {
            dataArr.push({ keys: [pool.gachaPoolId], value: { client: pool, details: poolDetails[i] } });
        })
    }

    await loadCollection(collection, dataArr, T.GachaPoolZod);
}
async function loadItems() {
    const collection = 'item';
    logTime(`${collection}: starting`);

    const itemTable = await fetchData('excel/item_table.json');
    const buildingData = await fetchData('excel/building_data.json');
    const items: { [key: string]: any } = itemTable.items;
    const manufactFormulas = buildingData.manufactFormulas; // Factory formulas
    const workshopFormulas = buildingData.workshopFormulas; // Workshop formulas

    const dataArr: PreDoc[] = Object.values(items).map(data => {
        let formula = null;
        if (data.buildingProductList.length > 0) {
            if (data.buildingProductList[0].roomType === 'MANUFACTURE') {
                formula = manufactFormulas[data.buildingProductList[0].formulaId];
            }
            else if (data.buildingProductList[0].roomType === 'WORKSHOP') {
                formula = workshopFormulas[data.buildingProductList[0].formulaId];
            }
        }

        return { keys: [data.itemId, data.name, data.name.split('\'').join('')], value: { data: data, formula: formula } };
    });

    await loadCollection(collection, dataArr, T.ItemZod);
}
async function loadModules() {
    const collection = 'module';
    logTime(`${collection}: starting`);

    const moduleTable = await fetchData('excel/uniequip_table.json');
    const battleDict = await fetchData('excel/battle_equip_table.json');
    const equipDict: { [key: string]: any } = moduleTable.equipDict;

    const dataArr: PreDoc[] = Object.values(equipDict).map(module => {
        G.moduleDict[module.uniEquipId] = { info: module, data: battleDict[module.uniEquipId] ?? null };
        return { keys: [module.uniEquipId], value: { info: module, data: battleDict[module.uniEquipId] ?? null } };
    });

    await loadCollection(collection, dataArr, T.ModuleZod);
}
async function loadOperators() {
    const collection = "operator";
    logTime(`${collection}: starting`);

    const operatorTable = await fetchData('excel/character_table.json');
    const patchChars = (await fetchData('excel/char_patch_table.json')).patchChars;
    const charEquip = (await fetchData('excel/uniequip_table.json')).charEquip;
    const charBaseBuffs = (await fetchData('excel/building_data.json')).chars;

    const opArr = [];
    for (const opId of Object.keys(operatorTable)) {
        opArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs));
    }
    for (const opId of Object.keys(patchChars)) {
        opArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs));
    }
    for (const op of opArr) {
        for (const key of op.keys) {
            G.operatorDict[key] = op.value;
        }
    }

    await loadCollection(collection, opArr, T.OperatorZod);
}
async function loadParadoxes() {
    const collection = 'paradox';
    logTime(`${collection}: starting`);

    const handbookTable = await fetchData('excel/handbook_info_table.json');
    const stages: { [key: string]: any } = handbookTable.handbookStageData;

    const dataArr: PreDoc[] = await Promise.all(Object.values(stages).map(async excel => {
        const levels = await fetchData(`levels/${excel.levelId.toLowerCase()}.json`);
        G.paradoxDict[excel.charId] = { excel: excel, levels: levels };
        return { keys: [excel.charId, excel.stageId], value: { excel: excel, levels: levels } };
    }));

    await loadCollection(collection, dataArr, T.ParadoxZod);
}
async function loadRanges() {
    const collection = 'range';
    logTime(`${collection}: starting`);

    const rangeTable: { [key: string]: any } = await fetchData('excel/range_table.json');

    const dataArr: PreDoc[] = Object.values(rangeTable).map(range => {
        G.rangeDict[range.id] = range;
        return { keys: [range.id], value: range };
    });

    await loadCollection(collection, dataArr, T.GridRangeZod);
}
async function loadRecruit() {
    const collection = 'recruitpool';
    logTime(`${collection}: starting`);

    const gachaTable = await fetchData('excel/gacha_table.json');
    const recruitDetail = gachaTable.recruitDetail;

    const regex = /<.[a-z]{2,5}?\.[^<]+>|<\/[^<]*>|<color=[^>]+>/g;
    const lines = (recruitDetail.replace(regex, '') ?? '')
        .split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const recruitables = `${lines[7]}/${lines[10]}/${lines[13]}/${lines[16]}/${lines[19]}/${lines[22]}`
        .split('/').map(line => G.operatorDict[line.trim().toLowerCase()].id);

    const dataArr: PreDoc[] = [{ keys: [collection], value: recruitables }];

    await loadCollection(collection, dataArr, null);
}
async function loadRogueThemes() {
    const collection = ["rogue", "rogue/stage", "rogue/toughstage", "rogue/relic", "rogue/variation"];
    logTime(`${collection.join(', ')}: starting`);

    const rogueTable = await fetchData('excel/roguelike_topic_table.json');
    const rogueDetails: { [key: string]: any } = rogueTable.details;
    const rogueTopics: { [key: string]: any } = rogueTable.topics;

    const numOfThemes = Object.keys(rogueDetails).length;

    const rogueArr: PreDoc[] = [];
    const rogueStageArr: PreDoc[][] = [];
    const rogueToughArr: PreDoc[][] = [];
    const rogueRelicArr: PreDoc[][] = [];
    const rogueVariationArr: PreDoc[][] = [];

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

        rogueArr[i] = { keys: [i.toString()], value: { name: rogueName, stageDict, toughStageDict, relicDict, variationDict } };
    }
    rogueArr.forEach((theme, i) => {
        rogueStageArr[i] = Object.keys(theme.value.stageDict).map(key => {
            const stage = theme.value.stageDict[key];
            return { keys: [stage.excel.id, stage.excel.name, stage.excel.code], value: stage };
        });
        rogueToughArr[i] = Object.keys(theme.value.toughStageDict).map(key => {
            const stage = theme.value.toughStageDict[key];
            return { keys: [stage.excel.id, stage.excel.name, stage.excel.code], value: stage };
        });
        rogueRelicArr[i] = Object.keys(theme.value.relicDict).map(key => {
            const relic = theme.value.relicDict[key];
            return { keys: [relic.id, relic.name], value: relic };
        });
        rogueVariationArr[i] = Object.keys(theme.value.variationDict).map(key => {
            const variation = theme.value.variationDict[key];
            return { keys: [variation.id, variation.outerName], value: variation };
        });
    });

    await loadCollection(collection[0], rogueArr, T.RogueThemeZod);
    for (let i = 0; i < numOfThemes; i++) {
        await loadCollection(`${collection[1]}/${i}`, rogueStageArr[i], T.RogueStageZod);
        await loadCollection(`${collection[2]}/${i}`, rogueToughArr[i], T.RogueStageZod);
        await loadCollection(`${collection[3]}/${i}`, rogueRelicArr[i], T.RogueRelicZod);
        await loadCollection(`${collection[4]}/${i}`, rogueVariationArr[i], T.RogueVariationZod);
    }
}
async function loadSandboxes() {
    const collection = ["sandbox", "sandbox/stage", "sandbox/item", "sandbox/weather"];
    logTime(`${collection.join(', ')}: starting`);

    const sandboxTable = await fetchData('excel/sandbox_perm_table.json');
    const basicInfo: { [key: string]: any } = sandboxTable.basicInfo;
    const SANDBOX_V2: { [key: string]: any } = sandboxTable.detail.SANDBOX_V2;

    const numOfThemes = Object.keys(basicInfo).length;

    const sandArr: PreDoc[] = [];
    const sandStageArr: PreDoc[][] = [];
    const sandItemArr: PreDoc[][] = [];
    const sandWeatherArr: PreDoc[][] = [];

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

        sandArr[i] = { keys: [i.toString()], value: { name, stageDict, itemDict, weatherDict } };
    }
    sandArr.forEach((theme, i) => {
        sandStageArr[i] = Object.keys(theme.value.stageDict).map(key => {
            const stage = theme.value.stageDict[key];
            return { keys: [stage.excel.stageId, stage.excel.name, stage.excel.code], value: stage };
        });
        sandItemArr[i] = Object.keys(theme.value.itemDict).map(key => {
            const item = theme.value.itemDict[key];
            return { keys: [item.data.itemId, item.data.itemName], value: item };
        });
        sandWeatherArr[i] = Object.keys(theme.value.weatherDict).map(key => {
            const weather = theme.value.weatherDict[key];
            return { keys: [weather.weatherId, weather.name], value: weather };
        });
    });

    await loadCollection(collection[0], sandArr, T.SandboxActZod);
    for (let i = 0; i < numOfThemes; i++) {
        await loadCollection(`${collection[1]}/${i}`, sandStageArr[i], T.SandboxStageZod);
        await loadCollection(`${collection[2]}/${i}`, sandItemArr[i], T.SandboxItemZod);
        await loadCollection(`${collection[3]}/${i}`, sandWeatherArr[i], T.SandboxWeatherZod);
    }
}
async function loadSkills() {
    const collection = 'skill';
    logTime(`${collection}: starting`);

    const characterTable: { [key: string]: any } = await fetchData('excel/character_table.json');
    const skillTable: { [key: string]: any } = await fetchData('excel/skill_table.json');

    const dataArr: PreDoc[] = Object.values(skillTable).map(excel => {
        const deploySkill = Object.values(characterTable)
            .flatMap(deploy => deploy.skills)
            .find(skill => skill?.skillId === excel.skillId) ?? null;
        const skill = { deploy: deploySkill, excel: excel };
        G.skillDict[excel.skillId.toLowerCase()] = skill;
        return { keys: [excel.skillId], value: skill };
    });

    await loadCollection(collection, dataArr, T.SkillZod);
}
async function loadSkins() {
    const collection = "skin";
    logTime(`${collection}: starting`);

    const skinTable = await fetchData('excel/skin_table.json');
    const charSkins: { [key: string]: any } = skinTable.charSkins;

    const skinArr: PreDoc[] = [];
    for (const skin of Object.values(charSkins)) {
        const charId = skin.tmplId ?? skin.charId
        if (!G.skinArrDict.hasOwnProperty(charId)) {
            G.skinArrDict[charId] = [];
        }
        G.skinArrDict[charId].push(skin);
        G.skinDict[skin.skinId] = skin;

        skinArr.push({ keys: [skin.skinId], value: skin });
    }

    await loadCollection(collection, skinArr, T.SkinZod);
}
async function loadStages() {
    const processArrayInParallel = async (items: any[], limit: number, handler) => {
        let index = 0;
        while (index < items.length) {
            const batch = items.slice(index, index + limit);
            await Promise.allSettled(batch.map(item => handler(item)));
            index += limit;
        }
    }

    const collection = ["stage", "toughstage"];
    logTime(`${collection[0]}, ${collection[1]}: starting`);

    const stageTable = await fetchData('excel/stage_table.json');
    const stages: { [key: string]: any } = stageTable.stages;
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

    const stageArr: PreDoc[] = [];
    const toughArr: PreDoc[] = [];

    await processArrayInParallel(stageEntries, 4, async (excel) => {
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
                toughArr.push({ keys: [code], value: [] }); // Multiple stages can have the same code, so each code maps to an array
            }

            const levels = await fetchData(`levels/${levelId}.json`);
            const stage = { excel: excel, levels: levels };

            toughArr.push({ keys: [excel.stageId, excel.stageId.split('#').join(''), excel.code, excel.name], value: [stage] });
            toughArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            toughArr.find(data => data.keys.includes(code))?.value.sort((a, b) => a.excel.levelId.localeCompare(b.excel.levelId));
        }
        else if (excel.difficulty === 'NORMAL') {
            if (!stageArr.find(data => data.keys.includes(code))) {
                stageArr.push({ keys: [code], value: [] }); // Multiple stages can have the same code, so each code maps to an array
            }

            const levels = await fetchData(`levels/${levelId}.json`);
            const stage = { excel: excel, levels: levels };

            stageArr.push({ keys: [excel.stageId, excel.code, excel.name], value: [stage] });
            stageArr.find(data => data.keys.includes(code))?.value.push(stage); // Stage code
            stageArr.find(data => data.keys.includes(code))?.value.sort((a, b) => a.excel.levelId.localeCompare(b.excel.levelId));
        }
    });

    await loadCollection(collection[0], stageArr, zod.array(T.StageZod));
    await loadCollection(collection[1], toughArr, zod.array(T.StageZod));
}

async function loadCnArchetypes() {
    const collection = 'cn/archetype';
    logTime(`${collection}: starting`);

    const moduleTable = await fetchCnData('excel/uniequip_table.json');
    const subProfDict: { [key: string]: any } = moduleTable.subProfDict;

    const dataArr: PreDoc[] = Object.values(subProfDict)
        .filter(subProf => !G.archetypeDict.hasOwnProperty(subProf.subProfessionId))
        .map(subProf => {
            G.cnarchetypeDict[subProf.subProfessionId] = subProf.subProfessionName;
            return { keys: [subProf.subProfessionId], value: subProf.subProfessionName };
        });

    await loadCollection(collection, dataArr, null);
}
async function loadCnBases() {
    const collection = 'cn/base';
    logTime(`${collection}: starting`);

    const buildingData = await fetchCnData('excel/building_data.json');
    const buffs: { [key: string]: any } = buildingData.buffs;

    const dataArr: PreDoc[] = Object.values(buffs)
        .filter(buff => !G.baseDict.hasOwnProperty(buff.buffId))
        .map(buff => {
            G.cnbaseDict[buff.buffId] = buff;
            return { keys: [buff.buffId], value: buff };
        });

    await loadCollection(collection, dataArr, null);
}
async function loadCnModules() {
    const collection = 'cn/module';
    logTime(`${collection}: starting`);

    const moduleTable = await fetchCnData('excel/uniequip_table.json');
    const battleDict: { [key: string]: any } = await fetchCnData('excel/battle_equip_table.json');
    const equipDict: { [key: string]: any } = moduleTable.equipDict;

    const dataArr: PreDoc[] = Object.values(equipDict)
        .filter(module => !G.moduleDict.hasOwnProperty(module.uniEquipId))
        .map(module => {
            G.cnmoduleDict[module.uniEquipId] = { info: module, data: battleDict[module.uniEquipId] ?? null };
            return { keys: [module.uniEquipId], value: { info: module, data: battleDict[module.uniEquipId] ?? null } };
        });

    await loadCollection(collection, dataArr, null);
}
async function loadCnOperators() {
    const collection = "cn/operator";
    logTime(`${collection}: starting`);

    const operatorTable = await fetchCnData('excel/character_table.json');
    const patchChars = (await fetchCnData('excel/char_patch_table.json')).patchChars;
    const charEquip = (await fetchCnData('excel/uniequip_table.json')).charEquip;
    const charBaseBuffs = (await fetchCnData('excel/building_data.json')).chars;

    const opArr = [];
    for (const opId of Object.keys(operatorTable)) {
        if (G.operatorDict.hasOwnProperty(opId)) continue;
        opArr.push(...readOperatorIntoArr(opId, operatorTable, charEquip, charBaseBuffs));
    }
    for (const opId of Object.keys(patchChars)) {
        if (G.operatorDict.hasOwnProperty(opId)) continue;
        opArr.push(...readOperatorIntoArr(opId, patchChars, charEquip, charBaseBuffs));
    }

    await loadCollection(collection, opArr, null);
}
async function loadCnParadoxes() {
    const collection = 'cn/paradox';
    logTime(`${collection}: starting`);

    const handbookTable = await fetchCnData('excel/handbook_info_table.json');
    const stages: { [key: string]: any } = handbookTable.handbookStageData;

    const dataArr: PreDoc[] = await Promise.all(Object.values(stages)
        .filter(excel => !G.paradoxDict.hasOwnProperty(excel.charId))
        .map(async excel => {
            const levels = await fetchCnData(`levels/${excel.levelId.toLowerCase()}.json`);
            G.cnparadoxDict[excel.charId] = { excel: excel, levels: levels };
            return { keys: [excel.charId, excel.stageId], value: { excel: excel, levels: levels } };
        })
    );

    await loadCollection(collection, dataArr, null);
}
async function loadCnRanges() {
    const collection = 'cn/range';
    logTime(`${collection}: starting`);

    const rangeTable: { [key: string]: any } = await fetchCnData('excel/range_table.json');

    const dataArr: PreDoc[] = Object.values(rangeTable)
        .filter(range => !G.rangeDict.hasOwnProperty(range.id))
        .map(range => {
            G.cnrangeDict[range.id] = range;
            return { keys: [range.id], value: range };
        });

    await loadCollection(collection, dataArr, null);
}
async function loadCnSkills() {
    const collection = 'cn/skill';
    logTime(`${collection}: starting`);

    const skillTable: { [key: string]: any } = await fetchCnData('excel/skill_table.json');

    const dataArr: PreDoc[] = Object.values(skillTable)
        .filter(skill => !G.skillDict.hasOwnProperty(skill.skillId.toLowerCase()))
        .map(skill => {
            G.cnskillDict[skill.skillId.toLowerCase()] = skill;
            return { keys: [skill.skillId], value: skill };
        });

    await loadCollection(collection, dataArr, null);
}
async function loadCnSkins() {
    const collection = "cn/skin";
    logTime(`${collection}: starting`);

    const skinTable = await fetchCnData('excel/skin_table.json');
    const charSkins: { [key: string]: any } = skinTable.charSkins;

    const skinArr: PreDoc[] = [];
    for (const skin of Object.values(charSkins)) {
        if (G.skinDict.hasOwnProperty(skin.skinId)) continue;

        if (!G.cnskinArrDict.hasOwnProperty(skin.charId)) {
            G.cnskinArrDict[skin.charId] = [];
        }
        G.cnskinArrDict[skin.charId].push(skin);

        skinArr.push({ keys: [skin.skinId], value: skin });
    }

    await loadCollection(collection, skinArr, null);
}

main();
