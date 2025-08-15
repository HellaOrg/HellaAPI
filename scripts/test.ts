import 'dotenv/config';
import * as T from 'hella-types';
import getDb from "../src/db";

let db;
const collections = [
    {
        name: 'base',
        schema: T.BaseZod,
    },
    {
        name: 'cc',
        schema: T.CCStageLegacyZod,
    },
    {
        name: 'ccb',
        schema: T.CCSeasonZod,
    },
    {
        name: 'ccb/legacy',
        schema: T.CCStageLegacyZod,
    },
    {
        name: 'ccb/stage',
        schema: T.CCStageZod,
    },
    {
        name: 'define',
        schema: T.DefinitionZod,
    },
    {
        name: 'deployable',
        schema: T.DeployableZod,
    },
    {
        name: 'enemy',
        schema: T.EnemyZod,
    },
    {
        name: 'event',
        schema: T.GameEventZod,
    },
    {
        name: 'gacha',
        schema: T.GachaPoolZod,
    },
    {
        name: 'item',
        schema: T.ItemZod,
    },
    {
        name: 'module',
        schema: T.ModuleZod,
    },
    {
        name: 'operator',
        schema: T.OperatorZod,
    },
    {
        name: 'paradox',
        schema: T.ParadoxZod,
    },
    {
        name: 'range',
        schema: T.GridRangeZod,
    },
    {
        name: 'rogue',
        schema: T.RogueThemeZod,
    },
    {
        name: 'sandbox',
        schema: T.SandboxActZod,
    },
    {
        name: 'skill',
        schema: T.SkillZod,
    },
    {
        name: 'skin',
        schema: T.SkinZod,
    },
    {
        name: 'stage',
        schema: T.StageZod,
        array: true
    },
    {
        name: 'toughstage',
        schema: T.StageZod,
        array: true
    }
];

async function main() {
    db = await getDb();
    let code = 0;

    for (const { name, schema, array } of collections) {
        console.log(`Checking ${name}...`);
        const cursor = db.collection(name).find();
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            try {
                if (array) {
                    for (const item of doc.value) {
                        schema.parse(item);
                    }
                } else {
                    schema.parse(doc.value);
                }
            } catch (e) {
                console.log(`${name} error for ${JSON.stringify(doc.canon.toLowerCase())}: ${e.message}`);
                code = 1;
            }
        }
    }
    console.log('Done');
    process.exit(code);
}

main();
