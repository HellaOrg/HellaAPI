import * as z from 'zod';

const BlackboardZod = z.strictObject({
    key: z.string(),
    value: z.number().nullable().optional(),
    valueStr: z.string().nullable().optional(),
});
const DefinedStringZod = z.strictObject({
    m_defined: z.boolean(),
    m_value: z.string().nullable(),
});
const DefinedStringArrayZod = z.strictObject({
    m_defined: z.boolean(),
    m_value: z.array(z.string()).nullable(),
});
const DefinedNumberZod = z.strictObject({
    m_defined: z.boolean(),
    m_value: z.number().nullable(),
});
const DefinedBooleanZod = z.strictObject({
    m_defined: z.boolean(),
    m_value: z.boolean().nullable(),
});

const AttributesKeyFrameZod = z.strictObject({
    level: z.number(),
    data: z.strictObject({
        maxHp: z.number(),
        atk: z.number(),
        def: z.number(),
        magicResistance: z.number(),
        cost: z.number(),
        blockCnt: z.number(),
        moveSpeed: z.number(),
        attackSpeed: z.number(),
        baseAttackTime: z.number(),
        respawnTime: z.number(),
        hpRecoveryPerSec: z.number(),
        spRecoveryPerSec: z.number(),
        maxDeployCount: z.number(),
        maxDeckStackCnt: z.number(),
        tauntLevel: z.number(),
        massLevel: z.number(),
        baseForceLevel: z.number(),
        stunImmune: z.boolean(),
        silenceImmune: z.boolean(),
        sleepImmune: z.boolean(),
        frozenImmune: z.boolean(),
        levitateImmune: z.boolean(),
        disarmedCombatImmune: z.boolean(),
        fearedImmune: z.boolean(),
    }),
});
const EnemyAttributesZod = z.strictObject({
    maxHp: DefinedNumberZod,
    atk: DefinedNumberZod,
    def: DefinedNumberZod,
    magicResistance: DefinedNumberZod,
    cost: DefinedNumberZod,
    blockCnt: DefinedNumberZod,
    moveSpeed: DefinedNumberZod,
    attackSpeed: DefinedNumberZod,
    baseAttackTime: DefinedNumberZod,
    respawnTime: DefinedNumberZod,
    hpRecoveryPerSec: DefinedNumberZod,
    spRecoveryPerSec: DefinedNumberZod,
    maxDeployCount: DefinedNumberZod,
    massLevel: DefinedNumberZod,
    baseForceLevel: DefinedNumberZod,
    tauntLevel: DefinedNumberZod.optional(),
    epDamageResistance: DefinedNumberZod.optional(),
    epResistance: DefinedNumberZod.optional(),
    damageHitratePhysical: DefinedNumberZod.optional(),
    damageHitrateMagical: DefinedNumberZod.optional(),
    stunImmune: DefinedBooleanZod,
    silenceImmune: DefinedBooleanZod,
    sleepImmune: DefinedBooleanZod.optional(),
    frozenImmune: DefinedBooleanZod.optional(),
    levitateImmune: DefinedBooleanZod.optional(),
    disarmedCombatImmune: DefinedBooleanZod.optional(),
    fearedImmune: DefinedBooleanZod.optional(),
});
const EnemySkillsZod = z.strictObject({
    prefabKey: z.string(),
    priority: z.number(),
    cooldown: z.number(),
    initCooldown: z.number(),
    spCost: z.number(),
    blackboard: z.array(BlackboardZod).nullable(),
});
const EnemySpDataZod = z.strictObject({
    spType: z.string(),
    maxSp: z.number(),
    initSp: z.number(),
    increment: z.number(),
});
const EnemyDataZod = z.strictObject({
    name: DefinedStringZod,
    description: DefinedStringZod,
    prefabKey: DefinedStringZod,
    attributes: EnemyAttributesZod,
    applyWay: DefinedStringZod.optional(),
    motion: DefinedStringZod.optional(),
    enemyTags: DefinedStringArrayZod.optional(),
    lifePointReduce: DefinedNumberZod,
    levelType: z.union([DefinedStringZod, DefinedNumberZod]).optional(),
    rangeRadius: DefinedNumberZod,
    numOfExtraDrops: DefinedNumberZod.optional(),
    viewRadius: DefinedNumberZod.optional(),
    notCountInTotal: DefinedBooleanZod.optional(),
    talentBlackboard: z.array(BlackboardZod).nullable(),
    skills: z.array(EnemySkillsZod).nullable(),
    spData: EnemySpDataZod.nullable(),
});
const LevelUpCostZod = z.strictObject({
    id: z.string(),
    count: z.number(),
    type: z.string(),
});
const ManufactFormulaZod = z.strictObject({
    formulaId: z.string(),
    itemId: z.string(),
    count: z.number(),
    weight: z.number(),
    costPoint: z.number(),
    formulaType: z.string(),
    buffType: z.string(),
    costs: z.array(LevelUpCostZod),
    requireRooms: z.array(
        z.strictObject({
            roomId: z.string(),
            roomLevel: z.number(),
            roomCount: z.number(),
        })
    ),
    requireStages: z.array(
        z.strictObject({
            stageId: z.string(),
            rank: z.number(),
        })
    ),
});
const WorkshopFormulaZod = z.strictObject({
    sortId: z.number(),
    formulaId: z.string(),
    rarity: z.number(),
    itemId: z.string(),
    count: z.number(),
    goldCost: z.number(),
    apCost: z.number(),
    formulaType: z.string(),
    buffType: z.string(),
    extraOutcomeRate: z.number(),
    extraOutcomeGroup: z.array(
        z.strictObject({
            weight: z.number(),
            itemId: z.string(),
            itemCount: z.number(),
        })
    ),
    costs: z.array(LevelUpCostZod),
    requireRooms: z.array(
        z.strictObject({
            roomId: z.string(),
            roomLevel: z.number(),
            roomCount: z.number(),
        })
    ),
    requireStages: z.array(
        z.strictObject({
            stageId: z.string(),
            rank: z.number(),
        })
    ),
});
const OperatorUnlockCondZod = z.strictObject({
    phase: z.union([z.string(), z.number()]),
    level: z.number(),
});
const LevelUpCostCondZod = z.strictObject({
    unlockCond: OperatorUnlockCondZod,
    lvlUpTime: z.number(),
    levelUpCost: z.array(LevelUpCostZod).nullable(),
});
const DeploySkillZod = z.strictObject({
    skillId: z.string().nullable(),
    overridePrefabKey: z.string().nullable(),
    overrideTokenKey: z.string().nullable(),
    levelUpCostCond: z.array(LevelUpCostCondZod),
    unlockCond: OperatorUnlockCondZod,
});
const StageCardZod = z.strictObject({
    initialCnt: z.number().optional(),
    hidden: z.boolean(),
    alias: z.string().nullable(),
    uniEquipIds: z.array(
        z.strictObject({
            key: z.string(),
            level: z.number(),
        })
    ).nullable().optional(),
    inst: z.strictObject({
        characterKey: z.string(),
        level: z.number(),
        phase: z.union([z.string(), z.number()]).optional(),
        favorPoint: z.number(),
        potentialRank: z.number(),
    }),
    skillIndex: z.number(),
    mainSkillLvl: z.number(),
    skinId: z.string().nullable(),
    tmplId: z.string().nullable().optional(),
    overrideSkillBlackboard: z.array(BlackboardZod).nullable().optional(),
});
const StageInstZod = StageCardZod.extend({
    position: z.strictObject({
        row: z.number(),
        col: z.number(),
    }),
    direction: z.union([z.string(), z.number()]).optional(),
});
const StageDefinesZod = z.strictObject({
    characterInsts: z.array(StageInstZod),
    tokenInsts: z.array(StageInstZod),
    characterCards: z.array(StageCardZod),
    tokenCards: z.array(StageCardZod),
});
const StageEffectZod = z.strictObject({
    key: z.string(),
    offset: z.strictObject({
        x: z.number(),
        y: z.number(),
        z: z.number(),
    }),
    direction: z.union([z.string(), z.number()]),
});
const StageActionZod = z.strictObject({
    actionType: z.union([z.string(), z.number()]),
    managedByScheduler: z.boolean(),
    key: z.string(),
    count: z.number(),
    preDelay: z.number(),
    interval: z.number(),
    routeIndex: z.number(),
    blockFragment: z.boolean(),
    autoPreviewRoute: z.boolean(),
    autoDisplayEnemyInfo: z.boolean().optional(),
    isUnharmfulAndAlwaysCountAsKilled: z.boolean(),
    hiddenGroup: z.string().nullable(),
    randomSpawnGroupKey: z.string().nullable().optional(),
    randomSpawnGroupPackKey: z.string().nullable().optional(),
    randomType: z.union([z.string(), z.number()]).optional(),
    refreshType: z.string().optional(),
    weight: z.number().optional(),
    dontBlockWave: z.boolean().optional(),
    isValid: z.boolean().optional(),
    extraMeta: z.null().optional(),
    actionId: z.null().optional(),
    forceBlockWaveInBranch: z.boolean().optional(),
});
const StageRouteZod = z.strictObject({
    motionMode: z.union([z.string(), z.number()]),
    startPosition: z.strictObject({
        row: z.number(),
        col: z.number(),
    }),
    endPosition: z.strictObject({
        row: z.number(),
        col: z.number(),
    }),
    spawnRandomRange: z.strictObject({
        x: z.number(),
        y: z.number(),
    }),
    spawnOffset: z.strictObject({
        x: z.number(),
        y: z.number(),
    }),
    checkpoints: z.array(
        z.strictObject({
            type: z.union([z.string(), z.number()]),
            time: z.number(),
            position: z.strictObject({
                row: z.number(),
                col: z.number(),
            }),
            reachOffset: z.strictObject({
                x: z.number(),
                y: z.number(),
            }),
            randomizeReachOffset: z.boolean(),
            reachDistance: z.number(),
        }),
    ).nullable(),
    allowDiagonalMove: z.boolean(),
    visitEveryTileCenter: z.boolean(),
    visitEveryNodeCenter: z.boolean(),
    visitEveryCheckPoint: z.boolean().optional(),
});
const StageDataZod = z.strictObject({
    options: z.strictObject({
        characterLimit: z.number(),
        maxLifePoint: z.number(),
        initialCost: z.number(),
        maxCost: z.number(),
        costIncreaseTime: z.number(),
        moveMultiplier: z.number(),
        steeringEnabled: z.boolean(),
        isTrainingLevel: z.boolean(),
        isHardTrainingLevel: z.boolean().optional(),
        isPredefinedCardsSelectable: z.boolean().optional(),
        maxPlayTime: z.number().optional(),
        functionDisableMask: z.union([z.string(), z.number()]),
        configBlackBoard: z.array(BlackboardZod).nullable().optional(),
    }),
    levelId: z.string().nullable(),
    mapId: z.string().nullable(),
    bgmEvent: z.string().nullable(),
    environmentSe: z.string().nullable(),
    mapData: z.strictObject({
        map: z.array(z.array(z.number())),
        tiles: z.array(
            z.strictObject({
                tileKey: z.string(),
                heightType: z.union([z.string(), z.number()]),
                buildableType: z.union([z.string(), z.number()]),
                passableMask: z.union([z.string(), z.number()]),
                playerSideMask: z.union([z.string(), z.number()]).optional(),
                blackboard: z.array(BlackboardZod).nullable(),
                effects: z.array(StageEffectZod).nullable(),
            })
        ),
        blockEdges: z.array(z.strictObject({
            pos: z.strictObject({
                row: z.number(),
                col: z.number(),
            }),
            direction: z.union([z.string(), z.number()]),
            blockMask: z.union([z.string(), z.number()]),
        })).nullable(),
        tags: z.array(z.string()).nullable(),
        effects: z.array(StageEffectZod).nullable(),
        layerRects: z.null().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
    }),
    tilesDisallowToLocate: z.tuple([]),
    runes: z.array(
        z.strictObject({
            difficultyMask: z.union([z.string(), z.number()]),
            key: z.string(),
            professionMask: z.union([z.string(), z.number()]).optional(),
            buildableMask: z.union([z.string(), z.number()]),
            blackboard: z.array(BlackboardZod),
        })
    ).nullable(),
    optionalRunes: z.array(z.null()).nullable().optional(),
    globalBuffs: z.array(
        z.strictObject({
            prefabKey: z.string(),
            blackboard: z.array(BlackboardZod).nullable(),
            overrideCameraEffect: z.null(),
            passProfessionMaskFlag: z.boolean().optional(),
            professionMask: z.union([z.string(), z.number()]).optional(),
            playerSideMask: z.string().optional(),
            useExtraData: z.boolean().optional(),
        })
    ).nullable(),
    routes: z.array(StageRouteZod.nullable()),
    extraRoutes: z.array(StageRouteZod.nullable()).optional(),
    enemies: z.array(
        z.strictObject({
            name: z.null(),
            description: z.null(),
            key: z.string(),
            attributes: z.strictObject({
                maxHp: z.number(),
                atk: z.number(),
                def: z.number(),
                magicResistance: z.number(),
                cost: z.number(),
                blockCnt: z.number(),
                moveSpeed: z.number(),
                attackSpeed: z.number(),
                baseAttackTime: z.number(),
                respawnTime: z.number(),
                hpRecoveryPerSec: z.number(),
                spRecoveryPerSec: z.number(),
                maxDeployCount: z.number(),
                maxDeckStackCnt: z.number(),
                tauntLevel: z.number(),
                massLevel: z.number(),
                baseForceLevel: z.number(),
                stunImmune: z.boolean(),
                silenceImmune: z.boolean(),
                sleepImmune: z.boolean(),
                frozenImmune: z.boolean(),
                levitateImmune: z.boolean(),
                disarmedCombatImmune: z.boolean(),
                fearedImmune: z.boolean().optional(),
            }),
            applyWay: z.string(),
            motion: z.string(),
            enemyTags: z.array(z.string()).nullable(),
            notCountInTotal: z.boolean(),
            alias: z.null(),
            lifePointReduce: z.number(),
            rangeRadius: z.number(),
            numOfExtraDrops: z.number(),
            viewRadius: z.number(),
            levelType: z.string(),
            talentBlackboard: z.array(BlackboardZod).nullable(),
            skills: z.array(EnemySkillsZod).nullable(),
            spData: EnemySpDataZod.nullable(),
            m_runtimeData: z.null().optional(),
        })
    ),
    enemyDbRefs: z.array(
        z.strictObject({
            useDb: z.boolean(),
            id: z.string(),
            level: z.number(),
            overwrittenData: EnemyDataZod.nullable(),
        })
    ),
    waves: z.array(
        z.strictObject({
            preDelay: z.number(),
            postDelay: z.number(),
            maxTimeWaitingForNextWave: z.number(),
            fragments: z.array(z.strictObject({
                preDelay: z.number(),
                actions: z.array(StageActionZod),
                name: z.string().nullable().optional(),
            })),
            advancedWaveTag: z.string().nullable().optional(),
            name: z.string().nullable().optional(),
        })
    ),
    branches: z.record(
        z.string(),
        z.strictObject({
            phases: z.array(z.strictObject({
                preDelay: z.number(),
                actions: z.array(StageActionZod),
                m_randomActionGroups: z.null().optional(),
                m_actionWithRandomSpawn: z.null().optional(),
                m_validActionPackKeys: z.null().optional(),
            })),
        }),
    ).nullable(),
    predefines: StageDefinesZod.nullable(),
    hardPredefines: StageDefinesZod.nullable().optional(),
    excludeCharIdList: z.null(),
    randomSeed: z.number(),
    operaConfig: z.string().nullable().optional(),
    runtimeData: z.null().optional(),
    cameraPlugin: z.string().nullable().optional(),
});
const RogueRelicZod = z.strictObject({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    usage: z.string(),
    obtainApproach: z.string(),
    iconId: z.string(),
    type: z.string(),
    subType: z.string(),
    rarity: z.string(),
    value: z.number(),
    sortId: z.number(),
    canSacrifice: z.boolean(),
    unlockCondDesc: z.string().nullable(),
});
const RogueStageZod = z.strictObject({
    excel: z.strictObject({
        id: z.string(),
        linkedStageId: z.string(),
        levelId: z.string(),
        levelReplaceIds: z.array(z.string()),
        code: z.string(),
        name: z.string(),
        loadingPicId: z.string(),
        description: z.string(),
        eliteDesc: z.string().nullable(),
        isBoss: z.number(),
        isElite: z.number(),
        difficulty: z.string(),
        capsulePool: z.string().nullable(),
        capsuleProb: z.number(),
        vutresProb: z.array(z.number()),
        boxProb: z.array(z.number()),
        specialNodeId: z.string().nullable(),
    }),
    levels: StageDataZod,
});
const RogueVariationZod = z.strictObject({
    id: z.string(),
    type: z.string(),
    outerName: z.string(),
    innerName: z.string(),
    functionDesc: z.string(),
    desc: z.string(),
    iconId: z.string().nullable(),
    sound: z.string().nullable(),
});
const SandboxItemZod = z.strictObject({
    craft: z.strictObject({
        itemId: z.string(),
        type: z.string(),
        buildingUnlockDesc: z.string(),
        materialItems: z.record(z.string(), z.number()),
        upgradeItems: z.record(z.string(), z.number()).nullable(),
        outputRatio: z.number(),
        withdrawRatio: z.number(),
        repairCost: z.number(),
        isHidden: z.boolean(),
        craftGroupId: z.string(),
        recipeLevel: z.number(),
    }).nullable(),
    drink: z.strictObject({
        id: z.string(),
        type: z.string(),
        count: z.number(),
    }).nullable(),
    foodMat: z.strictObject({
        id: z.string(),
        type: z.string(),
        attribute: z.string(),
        variantType: z.string(),
        bonusDuration: z.number(),
        buffDesc: z.string().nullable(),
        sortId: z.number(),
    }).nullable(),
    food: z.strictObject({
        id: z.string(),
        attributes: z.array(z.string()),
        recipes: z.array(z.strictObject({
            foodId: z.string(),
            mats: z.array(z.string()),
        })).nullable(),
        variants: z.array(z.strictObject({
            type: z.string(),
            name: z.string(),
            usage: z.string(),
        })),
        duration: z.number(),
        sortId: z.number(),
    }).nullable(),
    data: z.strictObject({
        itemId: z.string(),
        itemType: z.string(),
        itemName: z.string(),
        itemUsage: z.string(),
        itemDesc: z.string(),
        itemRarity: z.number(),
        sortId: z.number(),
        obtainApproach: z.string(),
    })
});
const SandboxStageZod = z.strictObject({
    excel: z.strictObject({
        stageId: z.string(),
        levelId: z.string(),
        code: z.string(),
        name: z.string(),
        description: z.string(),
        actionCost: z.number(),
        actionCostEnemyRush: z.number(),
    }),
    levels: StageDataZod,
});
const SandboxWeatherZod = z.strictObject({
    weatherId: z.string(),
    name: z.string(),
    weatherLevel: z.number(),
    weatherType: z.string(),
    weatherTypeName: z.string(),
    weatherIconId: z.string(),
    functionDesc: z.string(),
    description: z.string(),
    buffId: z.string().nullable(),
});

export const BaseZod = z.strictObject({
    buffId: z.string(),
    buffName: z.string(),
    buffIcon: z.string(),
    skillIcon: z.string(),
    sortId: z.number(),
    buffColor: z.string(),
    textColor: z.string(),
    buffCategory: z.string(),
    roomType: z.string(),
    description: z.string(),
});
export const CCStageLegacyZod = z.strictObject({
    const: z.strictObject({
        levelId: z.string(),
        location: z.string(),
        name: z.string(),
        description: z.string(),
    }),
    levels: StageDataZod,
});
export const CCStageZod = z.strictObject({
    excel: z.strictObject({
        stageId: z.string(),
        mapId: z.string(),
        levelId: z.string(),
        stageType: z.string(),
        code: z.string(),
        name: z.string(),
        loadingPicId: z.string(),
        description: z.string(),
        picId: z.string(),
        logoPicId: z.string(),
        startTime: z.number(),
        rewardEndTime: z.number(),
    }),
    levels: StageDataZod,
});
export const CCSeasonZod = z.strictObject({
    seasonId: z.string(),
    stageDict: z.record(z.string(), CCStageZod),
});
export const DefinitionZod = z.strictObject({
    termId: z.string(),
    termName: z.string(),
    description: z.string(),
});
export const EnemyZod = z.strictObject({
    excel: z.strictObject({
        enemyId: z.string(),
        enemyIndex: z.string(),
        enemyTags: z.array(z.string()).nullable(),
        sortId: z.number(),
        name: z.string(),
        enemyLevel: z.enum(['NORMAL', 'ELITE', 'BOSS']),
        description: z.string(),
        attackType: z.null(),
        ability: z.null(),
        isInvalidKilled: z.boolean(),
        overrideKillCntInfos: z.record(z.string(), z.number()),
        hideInHandbook: z.boolean(),
        hideInStage: z.boolean(),
        abilityList: z.array(
            z.strictObject({
                text: z.string(),
                textFormat: z.enum(['NORMAL', 'SILENCE', 'TITLE'])
            })
        ),
        linkEnemies: z.array(z.string()),
        damageType: z.array(z.enum(['PHYSIC', 'MAGIC', 'NO_DAMAGE', 'HEAL'])),
        invisibleDetail: z.boolean(),
    }),
    levels: z.strictObject({
        Key: z.string(),
        Value: z.array(
            z.strictObject({
                level: z.number(),
                enemyData: EnemyDataZod,
            })
        ),
    }),
});
export const GachaPoolZod = z.strictObject({
    client: z.strictObject({
        gachaPoolId: z.string(),
        gachaIndex: z.number(),
        openTime: z.number(),
        endTime: z.number(),
        gachaPoolName: z.string(),
        gachaPoolSummary: z.string(),
        gachaPoolDetail: z.string().nullable(),
        guaranteeName: z.string().nullable().optional(),
        guarantee5Avail: z.number(),
        guarantee5Count: z.number(),
        LMTGSID: z.string().nullable(),
        CDPrimColor: z.string().nullable(),
        CDSecColor: z.string().nullable(),
        freeBackColor: z.string().nullable().optional(),
        gachaRuleType: z.enum(['ATTAIN', 'CLASSIC', 'CLASSIC_ATTAIN', 'CLASSIC_DOUBLE', 'DOUBLE', 'FESCLASSIC', 'LIMITED', 'LINKAGE', 'NORMAL', 'SINGLE', 'SPECIAL']),
        dynMeta: z.union([
            z.strictObject({
                chooseRuleConst: z.string(),
                homeDescConst: z.string(),
                pickUpPerCharPercent: z.strictObject({
                    TIER_5: z.number(),
                    TIER_6: z.number(),
                }).optional(),
                rarityPickCharDict: z.record(z.string(), z.array(z.string())),
                scrollIndex: z.number(),
                star5ChooseRuleConst: z.string(),
                star6ChooseRuleConst: z.string(),
            }),
            z.strictObject({
                main6RarityCharId: z.string(),
                rare5CharList: z.array(z.string()),
                scrollIndex: z.number(),
                sub6RarityCharId: z.string(),
            }),
            z.strictObject({
                attainRare6CharList: z.array(z.string()),
                attainRare6Num: z.number(),
                scrollIndex: z.number().optional(),
            }),
            z.strictObject({
                detailInfo: z.string(),
                detailTitle: z.string(),
                homeIntroDesc: z.string(),
                rarityPickCharDict: z.record(z.string(), z.array(z.string())),
                star5ChooseRule: z.string(),
                star6ChooseRule: z.string(),
            })
        ]).nullable(),
        linkageRuleId: z.string().nullable(),
        linkageParam: z.strictObject({
            guaranteeTarget6Count: z.number(),
        }).nullable(),
        limitParam: z.strictObject({
            freeCount: z.number(),
            hasFreeChar: z.boolean(),
            limitedCharId: z.string(),
        }).nullable().optional(),
    }),
    details: z.strictObject({
        detailInfo: z.strictObject({
            gachaObjGroups: z.array(z.strictObject({
                groupType: z.number(),
                startIndex: z.number(),
                endIndex: z.number(),
            })).nullable(),
            availCharInfo: z.strictObject({
                perAvailList: z.array(
                    z.strictObject({
                        rarityRank: z.number(),
                        charIdList: z.array(z.string()),
                        totalPercent: z.number(),
                    })
                ),
            }),
            upCharInfo: z.strictObject({
                perCharList: z.array(
                    z.strictObject({
                        rarityRank: z.number(),
                        charIdList: z.array(z.string()),
                        percent: z.number(),
                        count: z.number(),
                    })
                ),
            }),
            limitedChar: z.union([z.string(), z.array(z.string())]).nullable(),
            weightUpCharInfoList: z.array(z.strictObject({
                rarityRank: z.number(),
                charId: z.string(),
                weight: z.number(),
            })).nullable(),
            gachaObjList: z.array(
                z.strictObject({
                    gachaObject: z.string(),
                    type: z.number(),
                    imageType: z.number(),
                    param: z.string().nullable(),
                })
            ),
        }),
        gachaObjGroupType: z.number(),
        hasRateUp: z.boolean().optional(),
        playerDataDelta: z.strictObject({
            modified: z.strictObject({}),
            deleted: z.strictObject({
                activity: z.strictObject({
                    TYPE_ACT9D0: z.array(z.string()),
                    CHECKIN_ONLY: z.array(z.string()),
                    LOGIN_ONLY: z.array(z.string()),
                }).optional(),
            }),
        }),
    }),
});
export const GameEventZod = z.strictObject({
    id: z.string(),
    type: z.union([z.string(), z.number()]),
    displayType: z.string(),
    name: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    rewardEndTime: z.number(),
    displayOnHome: z.boolean(),
    hasStage: z.boolean(),
    templateShopId: z.string().nullable(),
    medalGroupId: z.string().nullable(),
    ungroupedMedalIds: z.array(z.string()).nullable(),
    isReplicate: z.boolean(),
    needFixedSync: z.boolean(),
    trapDomainId: z.string().nullable(),
    recType: z.string().nullable(),
    isPageEntry: z.boolean(),
    isMagnify: z.boolean(),
    picGroup: z.array(z.null()),
    usePicGroup: z.boolean(),
});
export const GridRangeZod = z.strictObject({
    id: z.string(),
    direction: z.number(),
    grids: z.array(
        z.strictObject({
            row: z.number(),
            col: z.number(),
        })
    ),
});
export const ItemZod = z.strictObject({
    data: z.strictObject({
        itemId: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        rarity: z.string(),
        iconId: z.string(),
        overrideBkg: z.null(),
        stackIconId: z.string().nullable(),
        sortId: z.number(),
        usage: z.string().nullable(),
        obtainApproach: z.string().nullable(),
        hideInItemGet: z.boolean(),
        classifyType: z.string(),
        itemType: z.string(),
        stageDropList: z.array(
            z.strictObject({
                stageId: z.string(),
                occPer: z.string(),
            })
        ),
        buildingProductList: z.array(
            z.strictObject({
                roomType: z.string(),
                formulaId: z.string(),
            })
        ),
        voucherRelateList: z.array(
            z.strictObject({
                voucherId: z.string(),
                voucherItemType: z.string(),
            })
        ).nullable(),
    }),
    formula: z.union([ManufactFormulaZod, WorkshopFormulaZod]).nullable(),
});
export const ModuleZod = z.strictObject({
    info: z.strictObject({
        uniEquipId: z.string(),
        uniEquipName: z.string(),
        uniEquipIcon: z.string(),
        uniEquipDesc: z.string(),
        typeIcon: z.string(),
        typeName1: z.string(),
        typeName2: z.string().nullable(),
        equipShiningColor: z.string(),
        showEvolvePhase: z.string(),
        unlockEvolvePhase: z.string(),
        charId: z.string(),
        tmplId: z.string().nullable(),
        showLevel: z.number(),
        unlockLevel: z.number(),
        unlockFavorPoint: z.number().optional(),
        missionList: z.array(z.string()),
        unlockFavors: z.strictObject({
            1: z.number(),
            2: z.number(),
            3: z.number(),
        }).nullable(),
        itemCost: z.record(z.string(), z.array(LevelUpCostZod)).nullable(),
        type: z.string(),
        uniEquipGetTime: z.number(),
        uniEquipShowEnd: z.number(),
        charEquipOrder: z.number(),
        hasUnlockMission: z.boolean(),
        isSpecialEquip: z.boolean(),
        specialEquipDesc: z.string().nullable(),
        specialEquipColor: z.string().nullable(),
        charColor: z.string().nullable(),
    }),
    data: z.strictObject({
        phases: z.array(
            z.strictObject({
                equipLevel: z.number(),
                parts: z.array(
                    z.strictObject({
                        resKey: z.string().nullable(),
                        target: z.string(),
                        isToken: z.boolean(),
                        validInGameTag: z.string().nullable(),
                        addOrOverrideTalentDataBundle: z.strictObject({
                            candidates: z.array(
                                z.strictObject({
                                    displayRangeId: z.boolean(),
                                    upgradeDescription: z.string(),
                                    talentIndex: z.number(),
                                    unlockCondition: OperatorUnlockCondZod,
                                    requiredPotentialRank: z.number(),
                                    prefabKey: z.string(),
                                    name: z.string().nullable(),
                                    description: z.string().nullable(),
                                    rangeId: z.string().nullable(),
                                    blackboard: z.array(BlackboardZod),
                                    tokenKey: z.string().nullable().optional(),
                                    isHideTalent: z.boolean(),
                                }),
                            ).nullable(),
                        }),
                        overrideTraitDataBundle: z.strictObject({
                            candidates: z.array(
                                z.strictObject({
                                    additionalDescription: z.string().nullable(),
                                    unlockCondition: OperatorUnlockCondZod,
                                    requiredPotentialRank: z.number(),
                                    blackboard: z.array(BlackboardZod),
                                    overrideDescripton: z.string().nullable(),
                                    prefabKey: z.string().nullable(),
                                    rangeId: z.string().nullable(),
                                })
                            ).nullable(),
                        }),
                    })
                ),
                attributeBlackboard: z.array(BlackboardZod),
                tokenAttributeBlackboard: z.record(z.string(), z.array(BlackboardZod)),
            })
        ),
    }).nullable(),
});
export const ParadoxZod = z.strictObject({
    excel: z.strictObject({
        charId: z.string(),
        stageId: z.string(),
        levelId: z.string(),
        zoneId: z.string(),
        code: z.string(),
        name: z.string(),
        loadingPicId: z.string(),
        description: z.string(),
        unlockParam: z.array(
            z.strictObject({
                unlockType: z.string(),
                unlockParam1: z.string(),
                unlockParam2: z.string(),
                unlockParam3: z.null(),
            })
        ),
        rewardItem: z.array(
            z.strictObject({
                id: z.string(),
                count: z.number(),
                type: z.string(),
            })
        ),
        stageGetTime: z.number(),
    }),
    levels: StageDataZod,
});
export const RogueThemeZod = z.strictObject({
    name: z.string(),
    stageDict: z.record(z.string(), RogueStageZod),
    toughStageDict: z.record(z.string(), RogueStageZod),
    relicDict: z.record(z.string(), RogueRelicZod),
    variationDict: z.record(z.string(), RogueVariationZod),
});
export const SandboxActZod = z.strictObject({
    name: z.string(),
    itemDict: z.record(z.string(), SandboxItemZod),
    weatherDict: z.record(z.string(), SandboxWeatherZod),
    stageDict: z.record(z.string(), SandboxStageZod),
});
export const SkillZod = z.strictObject({
    deploy: DeploySkillZod.nullable(),
    excel: z.strictObject({
        skillId: z.string(),
        iconId: z.string().nullable(),
        hidden: z.boolean(),
        levels: z.array(
            z.strictObject({
                name: z.string(),
                rangeId: z.string().nullable(),
                description: z.string().nullable(),
                skillType: z.string(),
                durationType: z.string(),
                spData: z.strictObject({
                    spType: z.union([z.string(), z.number()]),
                    levelUpCost: z.null(),
                    maxChargeTime: z.number(),
                    spCost: z.number(),
                    initSp: z.number(),
                    increment: z.number(),
                }),
                prefabId: z.string().nullable(),
                duration: z.number(),
                blackboard: z.array(BlackboardZod),
            })
        )
    }),
});
export const SkinZod = z.strictObject({
    skinId: z.string(),
    charId: z.string(),
    tokenSkinMap: z.array(
        z.strictObject({
            tokenId: z.string(),
            tokenSkinId: z.string(),
        })
    ).nullable(),
    illustId: z.string().nullable(),
    dynIllustId: z.string().nullable(),
    avatarId: z.string(),
    portraitId: z.string().nullable(),
    dynPortraitId: z.string().nullable(),
    dynEntranceId: z.string().nullable(),
    buildingId: z.string().nullable(),
    battleSkin: z.strictObject({
        overwritePrefab: z.boolean(),
        skinOrPrefabId: z.string().nullable(),
    }),
    isBuySkin: z.boolean(),
    tmplId: z.string().nullable(),
    voiceId: z.string().nullable(),
    voiceType: z.string(),
    displaySkin: z.strictObject({
        skinName: z.string().nullable(),
        colorList: z.array(z.string()).nullable(),
        titleList: z.array(z.string()).nullable(),
        modelName: z.string().nullable(),
        drawerList: z.array(z.string()).nullable(),
        designerList: z.array(z.string()).nullable(),
        skinGroupId: z.string().nullable(),
        skinGroupName: z.string().nullable(),
        skinGroupSortIndex: z.number(),
        content: z.string().nullable(),
        dialog: z.string().nullable(),
        usage: z.string().nullable(),
        description: z.string().nullable(),
        obtainApproach: z.string().nullable(),
        sortId: z.number(),
        displayTagId: z.string().nullable(),
        getTime: z.number(),
        onYear: z.number(),
        onPeriod: z.number(),
    }),
});
export const StageZod = z.strictObject({
    excel: z.strictObject({
        stageType: z.string(),
        difficulty: z.string(),
        performanceStageFlag: z.string(),
        diffGroup: z.string(),
        unlockCondition: z.array(
            z.strictObject({
                stageId: z.string(),
                completeState: z.string(),
            })
        ),
        stageId: z.string(),
        levelId: z.string(),
        zoneId: z.string(),
        code: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        hardStagedId: z.string().nullable(),
        sixStarStageId: z.string().nullable().optional(),
        dangerLevel: z.string().nullable(),
        dangerPoint: z.number(),
        loadingPicId: z.string(),
        canPractice: z.boolean(),
        canBattleReplay: z.boolean(),
        apCost: z.number(),
        apFailReturn: z.number(),
        etItemId: z.string().nullable(),
        etCost: z.number(),
        etFailReturn: z.number(),
        etButtonStyle: z.string().nullable(),
        apProtectTimes: z.number(),
        diamondOnceDrop: z.number(),
        practiceTicketCost: z.number(),
        dailyStageDifficulty: z.number(),
        expGain: z.number(),
        goldGain: z.number(),
        loseExpGain: z.number(),
        loseGoldGain: z.number(),
        passFavor: z.number(),
        completeFavor: z.number(),
        slProgress: z.number(),
        displayMainItem: z.string().nullable(),
        hilightMark: z.boolean(),
        bossMark: z.boolean(),
        isPredefined: z.boolean(),
        isHardPredefined: z.boolean(),
        isSkillSelectablePredefined: z.boolean(),
        isStoryOnly: z.boolean(),
        appearanceStyle: z.string(),
        stageDropInfo: z.strictObject({
            firstPassRewards: z.null(),
            firstCompleteRewards: z.null(),
            passRewards: z.null(),
            completeRewards: z.null(),
            displayRewards: z.array(
                z.strictObject({
                    type: z.string(),
                    id: z.string(),
                    dropType: z.string(),
                })
            ),
            displayDetailRewards: z.array(
                z.strictObject({
                    occPercent: z.string(),
                    type: z.string(),
                    id: z.string(),
                    dropType: z.string(),
                })
            ),
        }),
        canUseCharm: z.boolean(),
        canUseTech: z.boolean(),
        canUseTrapTool: z.boolean(),
        canUseBattlePerformance: z.boolean(),
        canUseFirework: z.boolean().optional(),
        canContinuousBattle: z.boolean(),
        startButtonOverrideId: z.string().nullable(),
        isStagePatch: z.boolean(),
        mainStageId: z.string().nullable(),
        extraCondition: z.strictObject({
            index: z.number(),
            template: z.string(),
            unlockParam: z.array(z.string()),
        }).nullable(),
        extraInfo: z.array(
            z.strictObject({
                stageId: z.string(),
                rewards: z.array(
                    z.strictObject({
                        id: z.string(),
                        count: z.number(),
                        type: z.string(),
                    })
                ),
                progressInfo: z.strictObject({
                    progressType: z.string(),
                    descList: z.record(z.string(), z.string()),
                })
            })
        ).nullable(),
        sixStarBaseDesc: z.string().nullable().optional(),
        sixStarDisplayRewardList: z.null().optional(),
        advancedRuneIdList1: z.array(z.null()).optional(),
        advancedRuneIdList2: z.array(z.null()).optional(),
    }),
    levels: StageDataZod,
});
export const DeployableZod = z.strictObject({
    id: z.string(),
    archetype: z.string(),
    data: z.strictObject({
        name: z.string(),
        description: z.string().nullable(),
        canUseGeneralPotentialItem: z.boolean(),
        canUseActivityPotentialItem: z.boolean(),
        potentialItemId: z.string().nullable(),
        activityPotentialItemId: z.string().nullable(),
        classicPotentialItemId: z.string().nullable(),
        nationId: z.string().nullable(),
        groupId: z.string().nullable(),
        teamId: z.string().nullable(),
        displayNumber: z.string().nullable(),
        appellation: z.string(),
        position: z.string(),
        tagList: z.array(z.string()).nullable(),
        itemUsage: z.string().nullable(),
        itemDesc: z.string().nullable(),
        itemObtainApproach: z.string().nullable(),
        isNotObtainable: z.boolean(),
        isSpChar: z.boolean(),
        maxPotentialLevel: z.number(),
        rarity: z.string(),
        profession: z.string(),
        subProfessionId: z.string(),
        trait: z.strictObject({
            candidates: z.array(
                z.strictObject({
                    unlockCondition: OperatorUnlockCondZod,
                    requiredPotentialRank: z.number(),
                    blackboard: z.array(BlackboardZod),
                    overrideDescripton: z.string().nullable(),
                    prefabKey: z.string().nullable(),
                    rangeId: z.string().nullable(),
                })
            ),
        }).nullable(),
        phases: z.array(
            z.strictObject({
                characterPrefabKey: z.string(),
                rangeId: z.string().nullable(),
                maxLevel: z.number(),
                attributesKeyFrames: z.array(AttributesKeyFrameZod),
                evolveCost: z.union([z.array(LevelUpCostZod), z.null()]),
            })
        ),
        skills: z.array(DeploySkillZod),
        displayTokenDict: z.record(z.boolean()).nullable(),
        talents: z.array(
            z.strictObject({
                candidates: z.array(
                    z.strictObject({
                        unlockCondition: OperatorUnlockCondZod,
                        requiredPotentialRank: z.number(),
                        prefabKey: z.string(),
                        name: z.string().nullable(),
                        description: z.string().nullable(),
                        rangeId: z.string().nullable(),
                        blackboard: z.array(BlackboardZod),
                        tokenKey: z.string().nullable(),
                        isHideTalent: z.boolean(),
                    })
                ).nullable(),
            })
        ).nullable(),
        potentialRanks: z.array(
            z.strictObject({
                type: z.string(),
                description: z.string(),
                buff: z.strictObject({
                    attributes: z.strictObject({
                        abnormalFlags: z.null(),
                        abnormalImmunes: z.null(),
                        abnormalAntis: z.null(),
                        abnormalCombos: z.null(),
                        abnormalComboImmunes: z.null(),
                        attributeModifiers: z.array(
                            z.strictObject({
                                attributeType: z.string(),
                                formulaItem: z.string(),
                                value: z.number(),
                                loadFromBlackboard: z.boolean(),
                                fetchBaseValueFromSourceEntity: z.boolean(),
                            })
                        ),
                    }),
                }).nullable(),
                equivalentCost: z.null(),
            })
        ),
        favorKeyFrames: z.array(AttributesKeyFrameZod).nullable(),
        allSkillLvlup: z.array(
            z.strictObject({
                unlockCond: OperatorUnlockCondZod,
                lvlUpCost: z.array(LevelUpCostZod).nullable(),
            })
        ),
    }),
    range: GridRangeZod.nullable(),
    skills: z.array(SkillZod.nullable()),
    skins: z.array(SkinZod.nullable()),
});;
export const OperatorZod = DeployableZod.extend({
    bases: z.array(
        z.strictObject({
            condition: z.strictObject({
                buffId: z.string(),
                cond: OperatorUnlockCondZod,
            }),
            skill: BaseZod,
        })
    ),
    modules: z.array(ModuleZod),
    paradox: ParadoxZod.nullable(),
    recruit: z.number(),
})

export type Blackboard = z.infer<typeof BlackboardZod>;
export type Base = z.infer<typeof BaseZod>;
export type CCStageLegacy = z.infer<typeof CCStageLegacyZod>;
export type CCStage = z.infer<typeof CCStageZod>;
export type CCSeason = z.infer<typeof CCSeasonZod>;
export type Definition = z.infer<typeof DefinitionZod>;
export type Deployable = z.infer<typeof DeployableZod>;
export type Enemy = z.infer<typeof EnemyZod>;
export type GachaPool = z.infer<typeof GachaPoolZod>;
export type GameEvent = z.infer<typeof GameEventZod>;
export type GridRange = z.infer<typeof GridRangeZod>;
export type Item = z.infer<typeof ItemZod>;
export type LevelUpCost = z.infer<typeof LevelUpCostZod>;
export type Module = z.infer<typeof ModuleZod>;
export type Operator = z.infer<typeof OperatorZod>;
export type Paradox = z.infer<typeof ParadoxZod>;
export type RogueTheme = z.infer<typeof RogueThemeZod>;
export type RogueRelic = z.infer<typeof RogueRelicZod>;
export type RogueStage = z.infer<typeof RogueStageZod>;
export type RogueVariation = z.infer<typeof RogueVariationZod>;
export type SandboxAct = z.infer<typeof SandboxActZod>;
export type SandboxItem = z.infer<typeof SandboxItemZod>;
export type SandboxStage = z.infer<typeof SandboxStageZod>;
export type SandboxWeather = z.infer<typeof SandboxWeatherZod>;
export type Skill = z.infer<typeof SkillZod>;
export type Skin = z.infer<typeof SkinZod>;
export type Stage = z.infer<typeof StageZod>;
export type StageData = z.infer<typeof StageDataZod>;
