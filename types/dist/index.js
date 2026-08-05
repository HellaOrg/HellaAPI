import * as z from 'zod';
const AppearanceStyle = ['HIGH_DIFFICULTY', 'MAIN_NORMAL', 'MAIN_PREDEFINED', 'MIST_OPS', 'SPECIAL_STORY', 'SUB', 'TRAINING'];
const AttributeType = ['ATK', 'ATTACK_SPEED', 'COST', 'DEF', 'MAGIC_RESISTANCE', 'MAX_HP', 'RESPAWN_TIME'];
const BlockMask = ['FLY_ONLY', 'NONE', 'WALK_ONLY'];
const BuildableMask = ['ALL', 'MELEE', 'NONE', 'RANGED'];
const BuildableType = ['ALL', 'MELEE', 'NONE', 'RANGED'];
const BuffCategory = ['FUNCTION', 'OUTPUT', 'RECOVERY'];
const BuffType = ['M_ASC', 'M_DIAMOND', 'M_EXP', 'M_GOLD', 'W_ASC', 'W_BUILDING', 'W_EVOLVE', 'W_SKILL'];
const CardinalDirection = ['DOWN', 'LEFT', 'RIGHT', 'UP'];
const CheckpointType = ['APPEAR_AT_POS', 'DISAPPEAR', 'MAP_OFFSET_MOVE', 'MOVE', 'PATROL_MOVE', 'WAIT_BOSSRUSH_WAVE', 'WAIT_CURRENT_FRAGMENT_TIME', 'WAIT_CURRENT_WAVE_TIME', 'WAIT_FOR_SECONDS'];
const CompleteState = ['COMPLETE', 'PASS'];
const DropType = ['ADDITIONAL', 'COMPLETE', 'CONDITION_DROP', 'NORMAL', 'ONCE', 'SPECIAL'];
const DurationType = ['AMMO', 'NONE'];
const EnemyApplyWay = ['ALL', 'MELEE', 'NONE', 'RANGED'];
const EnemyLevelType = ['BOSS', 'ELITE', 'NORMAL'];
const EnemyMotion = ['FLY', 'WALK'];
const EnemySpType = ['INCREASE_WHEN_ATTACK', 'INCREASE_WHEN_TAKEN_DAMAGE', 'INCREASE_WITH_TIME', 'NONE'];
const EvolvePhase = ['PHASE_0', 'PHASE_2'];
const FormulaItem = ['ADDITION'];
const FormulaType = ['F_ASC', 'F_BUILDING', 'F_DIAMOND', 'F_EVOLVE', 'F_EXP', 'F_GOLD', 'F_SKILL'];
const GameEventDisplayType = ['BRANCHLINE', 'MINISTORY', 'NONE', 'SIDESTORY'];
const GameEventType = ['APRIL_FOOL', 'ARCADE', 'AUTOCHESS_SEASON', 'AUTOCHESS_VERIFY1', 'BLESS_ONLY', 'BOSS_RUSH', 'CHECKIN_ACCESS', 'CHECKIN_ALL_PLAYER', 'CHECKIN_ONLY', 'CHECKIN_VS', 'COLLECTION', 'DEFAULT', 'ENEMY_DUEL', 'FLIP_ONLY', 'FLOAT_PARADE', 'GRID_GACHA', 'GRID_GACHA_V2', 'HALFIDLE_VERIFY1', 'INTERLOCK', 'LOGIN_ONLY', 'MAINLINE_BP', 'MAIN_BUFF', 'MINISTORY', 'MISSION_ONLY', 'MULTIPLAY', 'MULTIPLAY_V3', 'MULTIPLAY_VERIFY2', 'PRAY_ONLY', 'RECRUIT_ONLY', 'ROGUELIKE', 'SWITCH_ONLY', 'TEAM_QUEST', 'TYPE_ACT12SIDE', 'TYPE_ACT13SIDE', 'TYPE_ACT17D7', 'TYPE_ACT17SIDE', 'TYPE_ACT20SIDE', 'TYPE_ACT21SIDE', 'TYPE_ACT24SIDE', 'TYPE_ACT25SIDE', 'TYPE_ACT27SIDE', 'TYPE_ACT29SIDE', 'TYPE_ACT35SIDE', 'TYPE_ACT36SIDE', 'TYPE_ACT38SIDE', 'TYPE_ACT3D0', 'TYPE_ACT42D0', 'TYPE_ACT42SIDE', 'TYPE_ACT44SIDE', 'TYPE_ACT45SIDE', 'TYPE_ACT46SIDE', 'TYPE_ACT4D0', 'TYPE_ACT5D0', 'TYPE_ACT5D1', 'TYPE_ACT9D0', 'TYPE_MAINSS', 'UNIQUE_ONLY', 'VEC_BREAK', 'VEC_BREAK_V2', 'YEAR_5_GENERAL'];
const GameEventRecType = ['CANNOT_COMPLETE', 'CAN_COMPLETE', 'SPECIAL'];
const HeightType = ['HIGHLAND', 'LOWLAND'];
const ItemClassifyType = ['CONSUME', 'MATERIAL', 'NONE', 'NORMAL'];
const ItemItemType = ['ACTIVITY_COIN', 'ACTIVITY_ITEM', 'ACTIVITY_POTENTIAL', 'AP_BASE', 'AP_GAMEPLAY', 'AP_ITEM', 'AP_SUPPLY', 'CARD_EXP', 'CLASSIC_FES_PICK_TIER_5', 'CLASSIC_FES_PICK_TIER_6', 'CLASSIC_SHD', 'CLASSIC_TKT_GACHA', 'CLASSIC_TKT_GACHA_10', 'CRS_RUNE_COIN', 'CRS_SHOP_COIN', 'CRS_SHOP_COIN_V2', 'DIAMOND', 'DIAMOND_SHD', 'EMOTICON_SET', 'EPGS_COIN', 'ET_STAGE', 'EXCLUSIVE_TKT_GACHA', 'EXCLUSIVE_TKT_GACHA_10', 'EXP_PLAYER', 'EXTERMINATION_AGENT', 'FAVOR_ADD_ITEM', 'GOLD', 'HGG_SHD', 'ITEM_PACK', 'LGG_SHD', 'LIMITED_BUFF', 'LIMITED_TKT_GACHA_10', 'LINKAGE_TKT_GACHA_10', 'LMTGS_COIN', 'MATERIAL', 'MATERIAL_ISSUE_VOUCHER', 'MCARD_VOUCHER', 'MEDAL', 'NEW_PROGRESS', 'OPTIONAL_VOUCHER_PICK', 'RENAMING_CARD', 'REP_COIN', 'RETRO_COIN', 'RETURN_CREDIT', 'RETURN_PROGRESS', 'RL_COIN', 'SANDBOX_TOKEN', 'SOCIAL_PT', 'TKT_GACHA', 'TKT_GACHA_10', 'TKT_GACHA_PRSV', 'TKT_INST_FIN', 'TKT_RECRUIT', 'TKT_TRY', 'UNI_COLLECTION', 'VOUCHER_CGACHA', 'VOUCHER_ELITE_II_4', 'VOUCHER_ELITE_II_5', 'VOUCHER_ELITE_II_6', 'VOUCHER_FULL_POTENTIAL', 'VOUCHER_LEVELMAX_4', 'VOUCHER_LEVELMAX_5', 'VOUCHER_LEVELMAX_6', 'VOUCHER_MGACHA', 'VOUCHER_PICK', 'VOUCHER_SKILL_SPECIALLEVELMAX_4', 'VOUCHER_SKILL_SPECIALLEVELMAX_5', 'VOUCHER_SKILL_SPECIALLEVELMAX_6', 'VOUCHER_SKIN'];
const ItemItemTypeLegacyNumeric = [85, 86, 87, 88, 90];
const ItemRarity = ['TIER_1', 'TIER_2', 'TIER_3', 'TIER_4', 'TIER_5', 'TIER_6'];
const LevelUpCostType = ['GOLD', 'MATERIAL'];
const ModuleType = ['ADVANCED', 'INITIAL'];
const MotionMode = ['E_NUM', 'FLY', 'WALK'];
const OccPer = ['ALMOST', 'ALWAYS', 'OFTEN', 'SOMETIMES', 'USUAL'];
const OperatorPhase = ['PHASE_0', 'PHASE_1', 'PHASE_2'];
const OperatorPosition = ['ALL', 'MELEE', 'NONE', 'RANGED'];
const OperatorProfession = ['CASTER', 'MEDIC', 'PIONEER', 'SNIPER', 'SPECIAL', 'SUPPORT', 'TANK', 'TOKEN', 'TRAP', 'WARRIOR'];
const ParadoxUnlockType = ['AWAKE'];
const PassableMask = ['ALL', 'FLY_ONLY', 'NONE'];
const PerformanceStageFlag = ['NORMAL_STAGE', 'PERFORMANCE_STAGE'];
const PlayerSideMask = ['ALL', 'NONE', 'SIDE_B'];
const PotentialRankType = ['BUFF', 'CUSTOM'];
const ProgressType = ['ONCE', 'PROGRESS'];
const Rarity = ['TIER_1', 'TIER_2', 'TIER_3', 'TIER_4', 'TIER_5', 'TIER_6'];
const RefreshType = ['ALWAYS', 'NEVER', 'PER_DAY', 'PER_SEASON', 'PER_SETTLE_DAY'];
const RewardType = ['ACTIVITY_ITEM', 'CARD_EXP', 'CHAR', 'CHARM', 'DIAMOND', 'ET_STAGE', 'FURN', 'GOLD', 'MATERIAL', 'PLOT_ITEM', 'TKT_RECRUIT'];
const RoomType = ['CONTROL', 'DORMITORY', 'HIRE', 'MANUFACTURE', 'MEETING', 'POWER', 'TRADING', 'TRAINING', 'WORKSHOP'];
const RogueRelicSubType = ['CURSE', 'NONE', 'RED_CAPSULE', 'SECRET', 'SINGLE_RAND_FREE', 'TEMP_TICKET', 'TOTEM_LOWER', 'TOTEM_UPPER'];
const RogueRelicType = ['ABSTRACT_DISASTER', 'ACTIVE_TOOL', 'BIGPILL', 'CHAOS', 'CHAOS_LEVEL', 'CHAOS_PURIFY', 'COPPER', 'COPPER_BUFF', 'COPPER_DRAW_NUM', 'CUSTOM_TICKET', 'DICE_POINT', 'DICE_TYPE', 'DISASTER', 'DISASTER_TYPE', 'DIVINATION_KIT', 'EXP', 'EXPLORE_TOOL', 'FEATURE', 'FRAGMENT', 'GOLD', 'HP', 'HPMAX', 'KEY_POINT', 'LOCKED_TREASURE', 'MAX_WEIGHT', 'PILL', 'POPULATION', 'RECRUIT_TICKET', 'RELIC', 'SAN_POINT', 'SHIELD', 'SPECIAL_ZONE_AP', 'SQUAD_CAPACITY', 'STASH_RECRUIT_LIMIT', 'TOTEM', 'TOTEM_EFFECT', 'UPGRADE_TICKET', 'VISION', 'WRATH'];
const RogueStageDifficulty = ['FOUR_STAR', 'NORMAL'];
const RogueVariationType = ['BAT', 'MAP', 'RES'];
const SandboxCraftType = ['BASE_BUILDING', 'COMBAT_BUILDING', 'TACTICAL'];
const SandboxDrinkType = ['FOOD', 'FOODMAT'];
const SandboxFoodAttribute = ['ATTACK', 'ENHANCED', 'NONE', 'SURVIVE'];
const SandboxFoodEffectType = ['ATTACK', 'COOLDOWN', 'COST', 'SKILL_POINT', 'SPECIAL', 'SURVIVE'];
const SandboxFoodVariantType = ['ALPHA', 'BETA', 'GAMMA', 'NONE'];
const SandboxItemType = ['ANIMAL', 'BUILDING', 'BUILDINGMAT', 'COIN', 'CRAFT', 'FOOD', 'FOODMAT', 'INSECT', 'PLACEHOLDER', 'SLUGITEM', 'SPECIALMAT', 'STAMINAPOT', 'TACTICAL'];
const SandboxWeatherType = ['DESERT', 'NORMAL', 'RAINFOREST', 'VOLCANO'];
const SkillSpType = ['INCREASE_WHEN_ATTACK', 'INCREASE_WHEN_TAKEN_DAMAGE', 'INCREASE_WITH_TIME', 'NONE'];
const SkillType = ['AUTO', 'MANUAL', 'PASSIVE'];
const SpTargetType = ['NONE', 'ROGUE'];
const StageActionType = ['ACTIVATE_PREDEFINED', 'BATTLE_EVENTS', 'DIALOG', 'DISPLAY_ENEMY_INFO', 'EMPTY', 'PLAY_BGM', 'PLAY_OPERA', 'PREVIEW_CURSOR', 'SPAWN', 'STORY', 'TRIGGER_PREDEFINED', 'WITHDRAW_PREDEFINED'];
const StageDifficulty = ['FOUR_STAR', 'NORMAL', 'SIX_STAR'];
const StageDiffGroup = ['ALL', 'EASY', 'NONE', 'NORMAL', 'TOUGH'];
const StageRandomType = ['ALWAYS', 'NEVER', 'PER_DAY', 'PER_SEASON', 'PER_SETTLE_DAY'];
const StageType = ['ACTIVITY', 'CAMPAIGN', 'CLIMB_TOWER', 'DAILY', 'GUIDE', 'MAIN', 'PERMANENT', 'SPECIAL_STORY', 'SUB', 'TEMPORARY'];
const VoucherItemType = ['MATERIAL_ISSUE_VOUCHER', 'OPTIONAL_VOUCHER_PICK'];
const VoiceType = ['ALL', 'ILLUST', 'NONE'];
const BlackboardZod = z.strictObject({
    key: z.string().nullable(),
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
        palsyImmune: z.boolean(),
        attractImmune: z.boolean(),
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
    epBreakRecoverSpeed: DefinedNumberZod.optional(),
    stunImmune: DefinedBooleanZod,
    silenceImmune: DefinedBooleanZod,
    sleepImmune: DefinedBooleanZod.optional(),
    frozenImmune: DefinedBooleanZod.optional(),
    levitateImmune: DefinedBooleanZod.optional(),
    disarmedCombatImmune: DefinedBooleanZod.optional(),
    fearedImmune: DefinedBooleanZod.optional(),
    palsyImmune: DefinedBooleanZod.optional(),
    attractImmune: DefinedBooleanZod.optional(),
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
    spType: z.enum(EnemySpType),
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
    type: z.enum(LevelUpCostType),
});
const ManufactFormulaZod = z.strictObject({
    formulaId: z.string(),
    itemId: z.string(),
    count: z.number(),
    weight: z.number(),
    costPoint: z.number(),
    formulaType: z.enum(FormulaType),
    buffType: z.enum(BuffType),
    costs: z.array(LevelUpCostZod),
    requireRooms: z.array(z.strictObject({
        roomId: z.string(),
        roomLevel: z.number(),
        roomCount: z.number(),
    })),
    requireStages: z.array(z.strictObject({
        stageId: z.string(),
        rank: z.number(),
    })),
});
const WorkshopFormulaZod = z.strictObject({
    sortId: z.number(),
    formulaId: z.string(),
    rarity: z.number(),
    itemId: z.string(),
    count: z.number(),
    goldCost: z.number(),
    apCost: z.number(),
    formulaType: z.enum(FormulaType),
    buffType: z.enum(BuffType),
    extraOutcomeRate: z.number(),
    extraOutcomeGroup: z.array(z.strictObject({
        weight: z.number(),
        itemId: z.string(),
        itemCount: z.number(),
    })),
    costs: z.array(LevelUpCostZod),
    requireRooms: z.array(z.strictObject({
        roomId: z.string(),
        roomLevel: z.number(),
        roomCount: z.number(),
    })),
    requireStages: z.array(z.strictObject({
        stageId: z.string(),
        rank: z.number(),
    })),
});
const OperatorUnlockCondZod = z.strictObject({
    phase: z.union([z.enum(OperatorPhase), z.number()]),
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
    uniEquipIds: z.array(z.strictObject({
        key: z.string(),
        level: z.number(),
    })).nullable().optional(),
    showSpIllust: z.boolean().optional(),
    masterInfos: z.null().optional(),
    inst: z.strictObject({
        characterKey: z.string(),
        level: z.number(),
        phase: z.union([z.enum(OperatorPhase), z.number()]).optional(),
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
    direction: z.union([z.enum(CardinalDirection), z.number()]).optional(),
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
    direction: z.union([z.enum(CardinalDirection), z.number()]),
});
const StageActionZod = z.strictObject({
    actionType: z.union([z.enum(StageActionType), z.number()]),
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
    randomType: z.union([z.enum(StageRandomType), z.number()]).optional(),
    refreshType: z.union([z.enum(RefreshType), z.number()]).optional(),
    weight: z.number().optional(),
    dontBlockWave: z.boolean().optional(),
    isValid: z.boolean().optional(),
    extraMeta: z.null().optional(),
    actionId: z.null().optional(),
    forceBlockWaveInBranch: z.boolean().optional(),
});
const StageRouteZod = z.strictObject({
    motionMode: z.union([z.enum(MotionMode), z.number()]),
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
    checkpoints: z.array(z.strictObject({
        type: z.union([z.enum(CheckpointType), z.number()]),
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
    })).nullable(),
    allowDiagonalMove: z.boolean(),
    visitEveryTileCenter: z.boolean(),
    visitEveryNodeCenter: z.boolean(),
    visitEveryCheckPoint: z.boolean().optional(),
});
const StageRune = z.strictObject({
    difficultyMask: z.union([z.string(), z.number()]),
    key: z.string(),
    professionMask: z.union([z.enum(['NONE', 'PIONEER', 'WARRIOR', 'TANK', 'SNIPER', 'CASTER', 'MEDIC', 'SUPPORT', 'SPECIAL', 'TRAP']), z.number()]).optional(),
    buildableMask: z.union([z.enum(BuildableMask), z.number()]),
    blackboard: z.array(BlackboardZod),
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
        displayRestTime: z.boolean().optional(),
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
        tiles: z.array(z.strictObject({
            tileKey: z.string(),
            heightType: z.union([z.enum(HeightType), z.number()]),
            buildableType: z.union([z.enum(BuildableType), z.number()]),
            passableMask: z.union([z.enum(PassableMask), z.number()]),
            playerSideMask: z.union([z.enum(PlayerSideMask), z.number()]).optional(),
            blackboard: z.array(BlackboardZod).nullable(),
            effects: z.array(StageEffectZod).nullable(),
        })),
        blockEdges: z.array(z.strictObject({
            pos: z.strictObject({
                row: z.number(),
                col: z.number(),
            }),
            direction: z.union([z.enum(CardinalDirection), z.number()]),
            blockMask: z.union([z.enum(BlockMask), z.number()]),
        })).nullable(),
        tags: z.array(z.string()).nullable(),
        effects: z.array(StageEffectZod).nullable(),
        layerRects: z.null().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
    }),
    tilesDisallowToLocate: z.tuple([]).nullable(),
    runes: z.array(StageRune).nullable(),
    optionalRunes: z.strictObject({
        rune_level1_1: z.array(StageRune),
        rune_level1_2: z.array(StageRune),
        rune_level2_1: z.array(StageRune),
        rune_level2_2: z.array(StageRune),
    }).nullable().optional(),
    globalBuffs: z.array(z.strictObject({
        prefabKey: z.string(),
        blackboard: z.array(BlackboardZod).nullable(),
        overrideCameraEffect: z.null(),
        passProfessionMaskFlag: z.boolean().optional(),
        professionMask: z.union([z.string(), z.number()]).optional(),
        playerSideMask: z.string().optional(),
        useExtraData: z.boolean().optional(),
    })).nullable(),
    routes: z.array(StageRouteZod.nullable()),
    extraRoutes: z.array(StageRouteZod.nullable()).optional(),
    enemies: z.array(z.strictObject({
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
            palsyImmune: z.boolean().optional(),
            attractImmune: z.boolean().optional(),
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
    })),
    enemyDbRefs: z.array(z.strictObject({
        useDb: z.boolean(),
        id: z.string(),
        level: z.number(),
        overwrittenData: EnemyDataZod.nullable(),
    })),
    waves: z.array(z.strictObject({
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
    })),
    branches: z.record(z.string(), z.strictObject({
        phases: z.array(z.strictObject({
            preDelay: z.number(),
            actions: z.array(StageActionZod),
            m_randomActionGroups: z.null().optional(),
            m_actionWithRandomSpawn: z.null().optional(),
            m_validActionPackKeys: z.null().optional(),
        })),
    })).nullable(),
    predefines: StageDefinesZod.nullable(),
    hardPredefines: StageDefinesZod.nullable().optional(),
    excludeCharIdList: z.null(),
    randomSeed: z.number(),
    operaConfig: z.string().nullable().optional(),
    runtimeData: z.null().optional(),
    cameraPlugin: z.string().nullable().optional(),
});
export const BaseZod = z.strictObject({
    buffId: z.string(),
    buffName: z.string(),
    buffIcon: z.string(),
    skillIcon: z.string(),
    sortId: z.number(),
    buffColor: z.string(),
    textColor: z.string(),
    buffCategory: z.enum(BuffCategory),
    roomType: z.enum(RoomType),
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
        stageType: z.enum(StageType),
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
        description: z.string().nullable(),
        attackType: z.null(),
        ability: z.null(),
        isInvalidKilled: z.boolean(),
        overrideKillCntInfos: z.record(z.string(), z.number()),
        hideInHandbook: z.boolean(),
        hideInStage: z.boolean(),
        abilityList: z.array(z.strictObject({
            text: z.string(),
            textFormat: z.enum(['NORMAL', 'SILENCE', 'TITLE'])
        })),
        linkEnemies: z.array(z.string()),
        damageType: z.array(z.enum(['PHYSIC', 'MAGIC', 'NO_DAMAGE', 'HEAL'])),
        invisibleDetail: z.boolean(),
    }),
    levels: z.strictObject({
        Key: z.string(),
        Value: z.array(z.strictObject({
            level: z.number(),
            enemyData: EnemyDataZod,
        })),
    }),
});
export const FactionZod = z.strictObject({
    powerId: z.string(),
    orderNum: z.number(),
    powerLevel: z.number(),
    powerName: z.string(),
    powerCode: z.string(),
    color: z.string(),
    isLimited: z.boolean(),
    isRaw: z.boolean(),
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
            version: z.number().optional(),
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
                perAvailList: z.array(z.strictObject({
                    rarityRank: z.number(),
                    charIdList: z.array(z.string()),
                    totalPercent: z.number(),
                })),
            }),
            upCharInfo: z.strictObject({
                perCharList: z.array(z.strictObject({
                    rarityRank: z.number(),
                    charIdList: z.array(z.string()),
                    percent: z.number(),
                    count: z.number(),
                })),
            }),
            limitedChar: z.union([z.string(), z.array(z.string())]).nullable(),
            weightUpCharInfoList: z.array(z.strictObject({
                rarityRank: z.number(),
                charId: z.string(),
                weight: z.number(),
            })).nullable(),
            gachaObjList: z.array(z.strictObject({
                gachaObject: z.string(),
                type: z.number(),
                imageType: z.number(),
                param: z.string().nullable(),
            })),
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
    type: z.enum(GameEventType),
    displayType: z.enum(GameEventDisplayType),
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
    recType: z.enum(GameEventRecType).nullable(),
    isPageEntry: z.boolean(),
    isMagnify: z.boolean(),
    picGroup: z.array(z.strictObject({
        sortIndex: z.number(),
        picId: z.string(),
        availCheck: z.strictObject({
            startTs: z.number(),
            endTs: z.number(),
            type: z.string(),
            rate: z.number(),
            stageUnlockParam: z.strictObject({
                stageId: z.string(),
            }).nullable(),
            charUnlockParam: z.null(),
        })
    })),
    usePicGroup: z.boolean(),
});
export const GridRangeZod = z.strictObject({
    id: z.string(),
    direction: z.number(),
    grids: z.array(z.strictObject({
        row: z.number(),
        col: z.number(),
    })),
});
export const ItemZod = z.strictObject({
    data: z.strictObject({
        itemId: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        rarity: z.enum(ItemRarity),
        iconId: z.string(),
        overrideBkg: z.null(),
        stackIconId: z.string().nullable(),
        sortId: z.number(),
        usage: z.string().nullable(),
        obtainApproach: z.string().nullable(),
        hideInItemGet: z.boolean(),
        classifyType: z.enum(ItemClassifyType),
        itemType: z.enum(ItemItemType).or(z.union([z.literal(85), z.literal(86), z.literal(87), z.literal(88), z.literal(90)])),
        stageDropList: z.array(z.strictObject({
            stageId: z.string(),
            occPer: z.enum(OccPer),
        })),
        buildingProductList: z.array(z.strictObject({
            roomType: z.string(),
            formulaId: z.string(),
        })),
        voucherRelateList: z.array(z.strictObject({
            voucherId: z.string(),
            voucherItemType: z.enum(VoucherItemType),
        })).nullable(),
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
        showEvolvePhase: z.enum(EvolvePhase),
        unlockEvolvePhase: z.enum(EvolvePhase),
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
        type: z.enum(ModuleType),
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
        phases: z.array(z.strictObject({
            equipLevel: z.number(),
            parts: z.array(z.strictObject({
                resKey: z.string().nullable(),
                target: z.string(),
                isToken: z.boolean(),
                validInGameTag: z.string().nullable(),
                validInMapTag: z.string().nullable(),
                addOrOverrideTalentDataBundle: z.strictObject({
                    candidates: z.array(z.strictObject({
                        displayRangeId: z.boolean(),
                        upgradeDescription: z.string(),
                        talentIndex: z.number(),
                        validModeIndices: z.array(z.number()).nullable(),
                        unlockCondition: OperatorUnlockCondZod,
                        requiredPotentialRank: z.number(),
                        prefabKey: z.string(),
                        name: z.string().nullable(),
                        description: z.string().nullable(),
                        rangeId: z.string().nullable(),
                        blackboard: z.array(BlackboardZod),
                        tokenKey: z.string().nullable().optional(),
                        isHideTalent: z.boolean(),
                    })).nullable(),
                }),
                overrideTraitDataBundle: z.strictObject({
                    candidates: z.array(z.strictObject({
                        additionalDescription: z.string().nullable(),
                        unlockCondition: OperatorUnlockCondZod,
                        requiredPotentialRank: z.number(),
                        blackboard: z.array(BlackboardZod),
                        overrideDescripton: z.string().nullable(),
                        prefabKey: z.string().nullable(),
                        rangeId: z.string().nullable(),
                    })).nullable(),
                }),
            })),
            attributeBlackboard: z.array(BlackboardZod),
            tokenAttributeBlackboard: z.record(z.string(), z.array(BlackboardZod)),
        })),
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
        unlockParam: z.array(z.strictObject({
            unlockType: z.enum(ParadoxUnlockType),
            unlockParam1: z.string(),
            unlockParam2: z.string(),
            unlockParam3: z.null(),
        })),
        rewardItem: z.array(z.strictObject({
            id: z.string(),
            count: z.number(),
            type: z.string(),
        })),
        stageGetTime: z.number(),
    }),
    levels: StageDataZod,
});
export const RogueRelicZod = z.strictObject({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    usage: z.string(),
    obtainApproach: z.string(),
    iconId: z.string(),
    itemIconGroupId: z.string().nullable(),
    type: z.enum(RogueRelicType),
    subType: z.enum(RogueRelicSubType),
    rarity: z.string(),
    sortId: z.number(),
    canSacrifice: z.boolean(),
    tinyIconColor: z.string().nullable(),
    unlockCondDesc: z.string().nullable(),
    shortUsage: z.string().nullable(),
});
export const RogueStageZod = z.strictObject({
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
        difficulty: z.enum(RogueStageDifficulty),
        capsulePool: z.string().nullable(),
        capsuleProb: z.number(),
        vutresProb: z.array(z.number()),
        boxProb: z.array(z.number()),
        specialNodeId: z.string().nullable(),
        redCapsulePool: z.string().nullable(),
        redCapsuleProb: z.number(),
    }),
    levels: StageDataZod,
});
export const RogueVariationZod = z.strictObject({
    id: z.string(),
    type: z.enum(RogueVariationType),
    outerName: z.string(),
    innerName: z.string(),
    functionDesc: z.string(),
    desc: z.string(),
    iconId: z.string().nullable(),
    sound: z.string().nullable(),
});
export const RogueThemeZod = z.strictObject({
    name: z.string(),
    stageDict: z.record(z.string(), RogueStageZod),
    toughStageDict: z.record(z.string(), RogueStageZod),
    relicDict: z.record(z.string(), RogueRelicZod),
    variationDict: z.record(z.string(), RogueVariationZod),
});
export const SandboxItemZod = z.strictObject({
    craft: z.strictObject({
        itemId: z.string(),
        type: z.enum(SandboxCraftType),
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
        type: z.enum(SandboxDrinkType),
        count: z.number(),
    }).nullable(),
    foodMat: z.strictObject({
        id: z.string(),
        type: z.string(),
        attribute: z.enum(SandboxFoodAttribute),
        variantType: z.enum(SandboxFoodVariantType),
        bonusDuration: z.number(),
        buffDesc: z.string().nullable(),
        sortId: z.number(),
    }).nullable(),
    food: z.strictObject({
        id: z.string(),
        attributes: z.array(z.enum(SandboxFoodEffectType)),
        recipes: z.array(z.strictObject({
            foodId: z.string(),
            mats: z.array(z.string()),
        })).nullable(),
        variants: z.array(z.strictObject({
            type: z.enum(SandboxFoodVariantType),
            name: z.string(),
            usage: z.string(),
        })),
        duration: z.number(),
        sortId: z.number(),
    }).nullable(),
    data: z.strictObject({
        itemId: z.string(),
        itemType: z.enum(SandboxItemType),
        itemName: z.string(),
        itemUsage: z.string(),
        itemDesc: z.string(),
        itemRarity: z.number(),
        sortId: z.number(),
        obtainApproach: z.string(),
    })
});
export const SandboxStageZod = z.strictObject({
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
export const SandboxWeatherZod = z.strictObject({
    weatherId: z.string(),
    name: z.string(),
    weatherLevel: z.number(),
    weatherType: z.enum(SandboxWeatherType),
    weatherTypeName: z.string(),
    weatherIconId: z.string(),
    functionDesc: z.string(),
    description: z.string(),
    buffId: z.string().nullable(),
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
        levels: z.array(z.strictObject({
            name: z.string(),
            rangeId: z.string().nullable(),
            description: z.string().nullable(),
            skillType: z.enum(SkillType),
            durationType: z.enum(DurationType),
            spData: z.strictObject({
                spType: z.enum(SkillSpType).or(z.literal(8)),
                levelUpCost: z.null(),
                maxChargeTime: z.number(),
                spCost: z.number(),
                initSp: z.number(),
                increment: z.number(),
            }),
            prefabId: z.string().nullable(),
            duration: z.number(),
            blackboard: z.array(BlackboardZod),
        }))
    }),
});
export const SkinZod = z.strictObject({
    skinId: z.string(),
    charId: z.string(),
    tokenSkinMap: z.array(z.strictObject({
        tokenId: z.string(),
        tokenSkinId: z.string(),
    })).nullable(),
    illustId: z.string().nullable(),
    spIllustId: z.string().nullable(),
    dynIllustId: z.string().nullable(),
    spDynIllustId: z.string().nullable(),
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
    voiceType: z.enum(VoiceType),
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
        stageType: z.enum(StageType),
        difficulty: z.enum(StageDifficulty),
        performanceStageFlag: z.enum(PerformanceStageFlag),
        diffGroup: z.enum(StageDiffGroup),
        unlockCondition: z.array(z.strictObject({
            stageId: z.string(),
            completeState: z.enum(CompleteState),
        })),
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
        maxSlot: z.number(),
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
        appearanceStyle: z.enum(AppearanceStyle),
        stageDropInfo: z.strictObject({
            firstPassRewards: z.null(),
            firstCompleteRewards: z.null(),
            passRewards: z.null(),
            completeRewards: z.null(),
            displayRewards: z.array(z.strictObject({
                type: z.enum(RewardType),
                id: z.string(),
                dropType: z.enum(DropType),
            })),
            displayDetailRewards: z.array(z.strictObject({
                occPercent: z.string(),
                type: z.enum(RewardType),
                id: z.string(),
                dropType: z.enum(DropType),
            })),
        }),
        canUseCharm: z.boolean(),
        canUseTech: z.boolean(),
        canUseTrapTool: z.boolean(),
        canUseBattlePerformance: z.boolean(),
        canUseFirework: z.boolean().optional(),
        canMultipleBattle: z.boolean(),
        startButtonOverrideId: z.string().nullable(),
        isStagePatch: z.boolean(),
        mainStageId: z.string().nullable(),
        extraCondition: z.strictObject({
            index: z.number(),
            template: z.string(),
            unlockParam: z.array(z.string()),
        }).nullable(),
        extraInfo: z.array(z.strictObject({
            stageId: z.string(),
            rewards: z.array(z.strictObject({
                id: z.string(),
                count: z.number(),
                type: z.enum(RewardType),
            })),
            progressInfo: z.strictObject({
                progressType: z.enum(ProgressType),
                descList: z.record(z.string(), z.string()),
            })
        })).nullable(),
        sixStarBaseDesc: z.string().nullable().optional(),
        sixStarDisplayRewardList: z.array(z.strictObject({
            id: z.string(),
            count: z.number(),
            type: z.string(),
        })).nullable().optional(),
        advancedRuneIdList1: z.array(z.null()).optional(),
        advancedRuneIdList2: z.array(z.null()).optional(),
        useSpecialSizeMapPreview: z.boolean(),
    }),
    levels: StageDataZod,
});
export const DeployableZod = z.strictObject({
    id: z.string(),
    archetype: z.string(),
    data: z.strictObject({
        name: z.string(),
        description: z.string().nullable(),
        sortIndex: z.number(),
        spTargetType: z.enum(SpTargetType),
        spTargetId: z.string().nullable(),
        canUseGeneralPotentialItem: z.boolean(),
        canUseActivityPotentialItem: z.boolean(),
        potentialItemId: z.string().nullable(),
        activityPotentialItemId: z.string().nullable(),
        classicPotentialItemId: z.string().nullable(),
        nationId: z.string().nullable(),
        groupId: z.string().nullable(),
        teamId: z.string().nullable(),
        mainPower: z.strictObject({
            nationId: z.string().nullable(),
            groupId: z.string().nullable(),
            teamId: z.string().nullable(),
        }),
        subPower: z.array(z.strictObject({
            nationId: z.string().nullable(),
            groupId: z.string().nullable(),
            teamId: z.string().nullable(),
        })).nullable(),
        displayNumber: z.string().nullable(),
        appellation: z.string(),
        position: z.enum(OperatorPosition),
        tagList: z.array(z.string()).nullable(),
        itemUsage: z.string().nullable(),
        itemDesc: z.string().nullable(),
        itemObtainApproach: z.string().nullable(),
        isNotObtainable: z.boolean(),
        isSpChar: z.boolean(),
        maxPotentialLevel: z.number(),
        rarity: z.enum(Rarity),
        profession: z.enum(OperatorProfession),
        subProfessionId: z.string(),
        trait: z.strictObject({
            candidates: z.array(z.strictObject({
                unlockCondition: OperatorUnlockCondZod,
                requiredPotentialRank: z.number(),
                blackboard: z.array(BlackboardZod),
                overrideDescripton: z.string().nullable(),
                prefabKey: z.string().nullable(),
                rangeId: z.string().nullable(),
            })),
        }).nullable(),
        phases: z.array(z.strictObject({
            characterPrefabKey: z.string(),
            rangeId: z.string().nullable(),
            maxLevel: z.number(),
            attributesKeyFrames: z.array(AttributesKeyFrameZod),
            evolveCost: z.array(LevelUpCostZod).nullable(),
        })),
        skills: z.array(DeploySkillZod),
        displayTokenDict: z.record(z.boolean()).nullable(),
        talents: z.array(z.strictObject({
            candidates: z.array(z.strictObject({
                unlockCondition: OperatorUnlockCondZod,
                requiredPotentialRank: z.number(),
                prefabKey: z.string(),
                name: z.string().nullable(),
                description: z.string().nullable(),
                rangeId: z.string().nullable(),
                blackboard: z.array(BlackboardZod),
                tokenKey: z.string().nullable(),
                isHideTalent: z.boolean(),
            })).nullable(),
        })).nullable(),
        potentialRanks: z.array(z.strictObject({
            type: z.enum(PotentialRankType),
            description: z.string(),
            buff: z.strictObject({
                attributes: z.strictObject({
                    abnormalFlags: z.null(),
                    abnormalImmunes: z.null(),
                    abnormalAntis: z.null(),
                    abnormalCombos: z.null(),
                    abnormalComboImmunes: z.null(),
                    attributeModifiers: z.array(z.strictObject({
                        attributeType: z.enum(AttributeType),
                        formulaItem: z.enum(FormulaItem),
                        value: z.number(),
                        loadFromBlackboard: z.boolean(),
                        fetchBaseValueFromSourceEntity: z.boolean(),
                    })),
                }),
            }).nullable(),
            equivalentCost: z.null(),
        })),
        favorKeyFrames: z.array(AttributesKeyFrameZod).nullable(),
        allSkillLvlup: z.array(z.strictObject({
            unlockCond: OperatorUnlockCondZod,
            lvlUpCost: z.array(LevelUpCostZod).nullable(),
        })),
    }),
    factions: z.array(z.strictObject({
        nationPower: FactionZod.nullable().optional(),
        groupPower: FactionZod.nullable().optional(),
        teamPower: FactionZod.nullable().optional(),
    })),
    range: GridRangeZod.nullable(),
    skills: z.array(SkillZod.nullable()),
    skins: z.array(SkinZod.nullable()),
});
;
export const OperatorZod = DeployableZod.extend({
    bases: z.array(z.strictObject({
        condition: z.strictObject({
            buffId: z.string(),
            cond: OperatorUnlockCondZod,
        }),
        skill: BaseZod,
    })),
    deploys: z.array(DeployableZod).nullable(),
    modules: z.array(ModuleZod),
    paradox: ParadoxZod.nullable(),
    recruit: z.number(),
});
