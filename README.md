# HellaAPI

![update status](https://github.com/Awedtan/HellaAPI/actions/workflows/update.yml/badge.svg)
![test status](https://github.com/Awedtan/HellaAPI/actions/workflows/test.yml/badge.svg)

> https://awedtan.ca/api

An Arknights EN game data API made for my own use. Data is loaded from [Kengxxiao/ArknightsGameData_YoStar](https://github.com/Kengxxiao/ArknightsGameData_YoStar), lightly massaged into a nicer format, and sent into a MongoDB database. Made with Express and self-hosted (RIP Cyclic). Also an under construction personal project.

## Usage

### Document Selection

To query the API for a document, send an HTTP GET request to an endpoint. Endpoints support four different selection modes:

#### Multi

> api/resource

Returns all documents under the specified resource type.

#### Single

> api/resource/{key}

Returns a single document whose `keys` includes the specified key. Checks for exact, whole string equality.

#### Match

> api/resource/match/{key}

Returns all documents whose `keys` includes the specified key. Checks for substring matches.

#### SearchV2

> api/resource/searchV2?filter={"field1": "value1", "field2": {">=": "value2"}, "field3": {"in": ["value3", "value4"]}}

Returns all documents that satisfy the specified filter. Supported search operators are:

| Operator | Description
|-|-|
| =   | Equal                                |
| !=  | Not equal                            |
| >   | Greater than                         |
| >=  | Greater than or equal                |
| <   | Less than                            |
| <=  | Less than or equal                   |
| in  | Matches any value in an array        |
| nin | Does not match any value in an array |

#### Search (legacy, use SearchV2 instead)

> api/resource/search?{field1}={value1}&{field2}>={value2}&{field3}<={value3}

Returns all documents where their fields are equal to, greater than, or less than the specified values. Uses dot notation for searching nested fields.

### Additional Parameters

In addition to the four selection modes, all endpoints also support the following parameters to narrow down what data the API returns:

#### Include

> api/resource?include={field1}&include={field2}

Specify fields to include in the response. If a request contains both `include` and `exclude` parameters, only `include` parameters will be considered.

#### Exclude

> api/resource?exclude={field1}&exclude={field2}

Specify fields to exclude from the response. If a request contains both `include` and `exclude` parameters, only `include` parameters will be considered.

#### Limit

> api/resource?limit={number}

Specify a maximum number of documents to return.

### Data format

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

This request will get all "Musha" operators (Hellagur, Utage, etc.) and returns their rarity.

> https://awedtan.ca/api/operator/search?data.subProfessionId=musha&include=data.rarity

The following two requests are functionally identical and will return the same object. They both exclude the `termId` and `termName` fields from the `Definition` object, leaving only the `description` field.

> https://awedtan.ca/api/define/slow?exclude=termId&exclude=termName
> 
> https://awedtan.ca/api/define/slow?include=description

Requests that return very large amounts of data may take a long time or even time out. By excluding unneeded fields, both response times and sizes can be dramatically decreased.

> This will likely time out:
>
> https://awedtan.ca/api/stage
>
> This probably won't time out but will still take a while:
>
> https://awedtan.ca/api/stage?exclude=levels
>
> This will have the fastest response time:
>
> https://awedtan.ca/api/stage?include=excel.name

## Endpoints

| Resources | Description | Valid Keys | [Return Type](https://github.com/Awedtan/HellaAPI/tree/main/types) |
|-|-|-|-|
| EN |
| https://awedtan.ca/api/archetype                | External archetype name | Internal archetype name       | `string`         |
| https://awedtan.ca/api/base                     | RIIC base skills        | Base skill ID                 | `Base`           |
| https://awedtan.ca/api/cc                       | CC stages               | Stage ID/name                 | `CCStageLegacy`  |
| https://awedtan.ca/api/ccb                      | CCB seasons             | Season ID                     | `CCSeason`       |
| https://awedtan.ca/api/ccb/legacy               | CCB legacy stages       | Stage ID/name                 | `CCStageLegacy`  |
| https://awedtan.ca/api/ccb/stage                | CCB stages              | Stage ID/name                 | `CCStage`        |
| https://awedtan.ca/api/define                   | In-game terms           | Term name                     | `Definition`     |
| https://awedtan.ca/api/deploy                   | Traps/summons/equipment | Deployable ID/name            | `Deployable`     |
| https://awedtan.ca/api/enemy                    | Enemies                 | Enemy ID/name/code            | `Enemy`          |
| https://awedtan.ca/api/event                    | Game events             | Event ID                      | `GameEvent`      |
| https://awedtan.ca/api/gacha                    | Gacha pools             | Pool ID                       | `GachaPool`      |
| https://awedtan.ca/api/item                     | Items                   | Item ID/name                  | `Item`           |
| https://awedtan.ca/api/module                   | Modules                 | Module ID                     | `Module`         |
| https://awedtan.ca/api/operator                 | Operators               | Operator ID/name              | `Operator`       |
| https://awedtan.ca/api/paradox                  | Paradox Simulations     | Operator ID                   | `Paradox`        |
| https://awedtan.ca/api/range                    | Operator attack ranges  | Range ID                      | `GridRange`      |
| https://awedtan.ca/api/rogue                    | Integrated Strategies   | IS index (IS2=0, IS3=1, etc.) | `RogueTheme`     |
| https://awedtan.ca/api/rogue/relic/{index}      | IS relics               | IS relic ID/name              | `RogueRelic`     |
| https://awedtan.ca/api/rogue/stage/{index}      | IS stages               | IS stage ID/name              | `RogueStage`     |
| https://awedtan.ca/api/rogue/toughstage/{index} | IS emergency stages     | IS stage ID/name              | `RogueStage`     |
| https://awedtan.ca/api/rogue/variation/{index}  | IS floor effects        | IS variation ID/name          | `RogueVariation` |
| https://awedtan.ca/api/sandbox                  | Reclamation Algorithm   | RA index (RA2=0, etc.)        | `SandboxAct`     |
| https://awedtan.ca/api/sandbox/item/{index}     | RA items                | RA item ID/name               | `SandboxItem`    |
| https://awedtan.ca/api/sandbox/stage/{index}    | RA stages               | RA stage ID/name              | `SandboxStage`   |
| https://awedtan.ca/api/sandbox/weather/{index}  | RA weather effects      | RA weather ID/name            | `SandboxWeather` |
| https://awedtan.ca/api/skill                    | Operator skills         | Skill ID                      | `Skill`          |
| https://awedtan.ca/api/skin                     | Operator skins          | Skin ID                       | `Skin`         |
| https://awedtan.ca/api/stage                    | Normal stages           | Stage ID/code                 | `Stage[]`        |
| https://awedtan.ca/api/toughstage               | Challenge stages        | Stage ID/code                 | `Stage[]`        |
| CN |
| https://awedtan.ca/api/cn/archetype             | External archetype name | Internal archetype name       | `string`         |
| https://awedtan.ca/api/cn/base                  | RIIC base skills        | Base skill ID                 | `Base`           |
| https://awedtan.ca/api/cn/module                | Modules                 | Module ID                     | `Module`         |
| https://awedtan.ca/api/cn/operator              | Operators               | Operator ID/name              | `Operator`       |
| https://awedtan.ca/api/cn/paradox               | Paradox Simulations     | Operator ID                   | `Paradox`        |
| https://awedtan.ca/api/cn/range                 | Operator attack ranges  | Range ID                      | `GridRange`      |
| https://awedtan.ca/api/cn/skill                 | Operator skills         | Skill ID                      | `Skill`          |
| https://awedtan.ca/api/cn/skin                  | Operator skins          | Skin ID                       | `Skin`         |
| Misc |
| https://awedtan.ca/api/about |
| https://awedtan.ca/api/new |
| https://awedtan.ca/api/recruitpool |

## Acknowledgements

[Kengxxiao/ArknightsGameData_YoStar](https://github.com/Kengxxiao/ArknightsGameData_YoStar) for providing the raw game data.

[thesadru/ArkPRTS](https://github.com/thesadru/ArkPRTS) for providing direct access to official game servers and data.
