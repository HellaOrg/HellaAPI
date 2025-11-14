# HellaAPI

[![update](https://github.com/HellaOrg/HellaAPI/actions/workflows/update.yml/badge.svg)](https://github.com/HellaOrg/HellaAPI/actions/workflows/update.yml)
[![test](https://github.com/HellaOrg/HellaAPI/actions/workflows/test.yml/badge.svg)](https://github.com/HellaOrg/HellaAPI/actions/workflows/test.yml)

> https://awedtan.ca/api/operator/hellagur

An Arknights EN game data API. Data is fetched from [HellaAssets](https://github.com/HellaOrg/HellaAssets) and official game servers, lightly massaged into a nicer format, and stored in a MongoDB database. Made with Express and self-hosted (RIP Cyclic). Also an under construction personal project.

## Usage

### Document Selection Modes

#### Multi

> api/{resource}

Returns all documents under the specified resource type.

#### Single

> api/{resource}/{key}

Returns a single document whose `keys` includes the specified key. Checks for exact, whole string equality.

#### Match

> api/{resource}/match/{key}

Returns all documents whose `keys` includes the specified key. Checks for substring matches.

#### Search

> api/{resource}/search?{field1}={value1}&{field2}>={value2}&{field3.subfield}<={value3}

Returns all documents where their fields are equal to, greater than or equal to, or less than or equal to the specified values. Uses dot notation for searching nested fields.

#### SearchV2

> api/{resource}/searchv2?filter={"field1": "value1", "field2": {">=": "value2"}, "field3": {"in": ["value3", "value4"]}}

> [!NOTE]
> The curly braces `{}` in the `filter` parameter do not denote placeholder values; they are literal characters that are to be included in the request.

Returns all documents that satisfy the specified filter. The above example will return documents where:
- `field1` is equal to `value1`
- `field2` is greater than or equal to `value2`
- `field3` is equal to either `value3` or `value4`    

Supported filter operators are:

| Operator | Description
|-|-|
| `=`, `eq`   | Equal                                |
| `!=`, `ne`  | Not equal                            |
| `>`, `gt`   | Greater than                         |
| `>=`, `ge`  | Greater than or equal                |
| `<`, `lt`   | Less than                            |
| `<=`, `le`  | Less than or equal                   |
| `in`      | Equal to any value in an array         |
| `nin`     | Not equal to any value in an array     |

### Additional Parameters

The following parameters are generally applicable to any of the above document selection modes.

> [!NOTE]
> If a request contains both `include` and `exclude` parameters, only `include` parameters will be taken into consideration.

#### Include

> api/{resource}?include={field1}&include={field2}

Specify fields to include in documents. If include parameters are present, all other fields are excluded by default.

#### Exclude

> api/{resource}?exclude={field1}&exclude={field2}

Specify fields to exclude from documents.

#### Sort

> api/{resource}?sort={"field1": "desc", "field2": "asc"}

Sort returned documents by the specified fields and directions. Earlier fields take priority over later fields.

#### Limit

> api/{resource}?limit={number}

Specify a maximum number of documents to return.

### Response Format

Valid responses will have the below JSON format. The `keys` array contains all valid keys for that resource, and the `value` field is where the actual information resides.

```
{
    _id: string,
    meta: { ... },
    canon: canon_key,
    keys: [ key1, key2, ... ],
    value: {
        ...
    }
}
```

### Examples

This request will return the rarity of all "Musha" operators (Hellagur, Utage, etc.).

> https://awedtan.ca/api/operator/search?data.subProfessionId=musha&include=data.rarity

The following two requests are functionally identical. They exclude the `termId` and `termName` fields from the `Definition` object, leaving only its `description` field.

> https://awedtan.ca/api/define/slow?exclude=termId&exclude=termName
> 
> https://awedtan.ca/api/define/slow?include=description

Requests that return very large amounts of data may take a long time. By excluding unneeded fields, response times can be dramatically improved.

> Large request: https://awedtan.ca/api/stage?include=excel
>
> 10x faster: https://awedtan.ca/api/stage?include=excel.name

## Resource Endpoints

| Resource | Description | Valid Keys | [Return Type](https://github.com/HellaOrg/HellaAPI/tree/main/types) |
|-|-|-|-|
| [/archetype](https://awedtan.ca/api/archetype)                               | External archetype name | Internal archetype name       | `string`         |
| [/base](https://awedtan.ca/api/base)                                         | RIIC base skills        | Base skill ID                 | `Base`           |
| [/cc](https://awedtan.ca/api/cc)                                             | CC stages               | Stage ID/name                 | `CCStageLegacy`  |
| [/ccb](https://awedtan.ca/api/ccb)                                           | CCB seasons             | Season ID                     | `CCSeason`       |
| [/ccb/legacy](https://awedtan.ca/api/ccb/legacy)                             | CCB legacy stages       | Stage ID/name                 | `CCStageLegacy`  |
| [/ccb/stage](https://awedtan.ca/api/ccb/stage)                               | CCB stages              | Stage ID/name                 | `CCStage`        |
| [/define](https://awedtan.ca/api/define)                                     | In-game terms           | Term name                     | `Definition`     |
| [/deploy](https://awedtan.ca/api/deploy)                                     | Traps/summons/equipment | Deployable ID/name            | `Deployable`     |
| [/enemy](https://awedtan.ca/api/enemy)                                       | Enemies                 | Enemy ID/name/code            | `Enemy`          |
| [/event](https://awedtan.ca/api/event)                                       | Game events             | Event ID                      | `GameEvent`      |
| [/gacha](https://awedtan.ca/api/gacha)                                       | Gacha pools             | Pool ID                       | `GachaPool`      |
| [/item](https://awedtan.ca/api/item)                                         | Items                   | Item ID/name                  | `Item`           |
| [/module](https://awedtan.ca/api/module)                                     | Modules                 | Module ID                     | `Module`         |
| [/operator](https://awedtan.ca/api/operator)                                 | Operators               | Operator ID/name              | `Operator`       |
| [/paradox](https://awedtan.ca/api/paradox)                                   | Paradox Simulations     | Operator ID                   | `Paradox`        |
| [/range](https://awedtan.ca/api/range)                                       | Operator attack ranges  | Range ID                      | `GridRange`      |
| [/rogue](https://awedtan.ca/api/rogue)                                       | Integrated Strategies   | IS index (IS2=0, IS3=1, etc.) | `RogueTheme`     |
| [/rogue/relic/{index}](https://awedtan.ca/api/rogue/relic/{index})           | IS relics               | IS relic ID/name              | `RogueRelic`     |
| [/rogue/stage/{index}](https://awedtan.ca/api/rogue/stage/{index})           | IS stages               | IS stage ID/name              | `RogueStage`     |
| [/rogue/toughstage/{index}](https://awedtan.ca/api/rogue/toughstage/{index}) | IS emergency stages     | IS stage ID/name              | `RogueStage`     |
| [/rogue/variation/{index}](https://awedtan.ca/api/rogue/variation/{index})   | IS floor effects        | IS variation ID/name          | `RogueVariation` |
| [/sandbox](https://awedtan.ca/api/sandbox)                                   | Reclamation Algorithm   | RA index (RA2=0, etc.)        | `SandboxAct`     |
| [/sandbox/item/{index}](https://awedtan.ca/api/sandbox/item/{index})         | RA items                | RA item ID/name               | `SandboxItem`    |
| [/sandbox/stage/{index}](https://awedtan.ca/api/sandbox/stage/{index})       | RA stages               | RA stage ID/name              | `SandboxStage`   |
| [/sandbox/weather/{index}](https://awedtan.ca/api/sandbox/weather/{index})   | RA weather effects      | RA weather ID/name            | `SandboxWeather` |
| [/skill](https://awedtan.ca/api/skill)                                       | Operator skills         | Skill ID                      | `Skill`          |
| [/skin](https://awedtan.ca/api/skin)                                         | Operator skins          | Skin ID                       | `Skin`           |
| [/stage](https://awedtan.ca/api/stage)                                       | Normal stages           | Stage ID/code                 | `Stage[]`        |
| [/toughstage](https://awedtan.ca/api/toughstage)                             | Challenge stages        | Stage ID/code                 | `Stage[]`        |
| Non-standard resources |
| [/about](https://awedtan.ca/api/about)                                       | API meta information |-|-|
| [/new](https://awedtan.ca/api/new)                                           | Data added in most recent update |-|-|
| [/recruitpool](https://awedtan.ca/api/recruitpool)                           | Recruitable operators |-| `string[]` |

## Installation

### API Server

0. Spin up a MongoDB instance somewhere and populate it with data
   - See the [MongoDB documentation](https://www.mongodb.com/docs/) to get started with MongoDB
   - See [Loading the Database](#loading-the-database) for details on populating the database
1. Install [Node.js](https://nodejs.org)
2. Clone or download this repository
```sh
git clone https://github.com/HellaOrg/HellaAPI.git --depth=1
```
3. Install the project dependencies
```sh
cd HellaAPI
npm install
```
4. Rename `sample.env` to `.env` and fill in the fields
```sh
PORT=3000
MONGO_URI=your_db_uri_here

# below are unneeded for API server, can ignore
YOSTAR_UID=your_uid_here
YOSTAR_TOKEN=your_token_here
YOSTAR_EMAIL=your_email_here
```
5. Run the server!
```sh
npm start
```

### Loading the Database

Loading the database is a separate operation from running the API server, and updates can be performed in a completely different environment. The following steps assume this is the case.

1. Install [Node.js](https://nodejs.org)
2. Clone or download this repository
```sh
git clone https://github.com/HellaOrg/HellaAPI.git --depth=1
```
3. In the project directory, perform a sparse checkout of [HellaAssets](https://github.com/HellaOrg/HellaAssets)
```sh
cd HellaAPI
git clone --depth=1 --no-checkout --filter=blob:none https://github.com/HellaOrg/HellaAssets
cd HellaAssets
git sparse-checkout init --cone
git sparse-checkout set gamedata
git checkout main
cd ..
```
4. Install the project dependencies
```sh
npm install
pip install -r scripts/requirements.txt
```

5. Rename `sample.env` to `.env` and fill in the fields
   - See [YoStar Authentication](#yostar-authentication) for prerequisites to loading CCB data
```sh
PORT=3000 # unneeded for loading, can ignore
MONGO_URI=your_db_uri_here

# below are optional, required for loading CCB data
YOSTAR_UID=your_uid_here
YOSTAR_TOKEN=your_token_here
YOSTAR_EMAIL=your_email_here
```
6. Run the load script!
```sh
npm run ci
npm run ci -- -c ccb # optional, not loaded by default, requires YoStar authentication
```
8. (Optional) Verify that the data conforms to the specifications in [HellaTypes](https://github.com/HellaOrg/HellaAPI/tree/main/types)
```sh
npm run test
```

### YoStar Authentication

A YoStar login is required for loading gacha pool and Contingency Contract Battleplan data, as these are fetched directly from official game servers. Gacha data can be fetched using a fresh guest account, no authentication is needed for it.

CCB requires an account to have cleared 2-10, so you will need to authenticate with a real account. Additionally, data for a CCB event is only made available while the event is active. The game servers do not provide data for past CCB events.

To generate an account UID and token, fill in `YOSTAR_EMAIL` with your YoStar account email, then run the [login helper script](https://github.com/HellaOrg/HellaAPI/blob/main/scripts/login.py).

If you do not need to fetch CCB data, you can safely ignore the `YOSTAR_*` fields in the `.env` file.

## Acknowledgements

The people over at [MooncellWiki](https://github.com/MooncellWiki/) for their datamining efforts and their freely available resources.

[thesadru/ArkPRTS](https://github.com/thesadru/ArkPRTS) for providing direct access to official game servers and data.
