export const TURN_CHANGE_ID = '0000';
export const TURN_CHANGE_INFO = ['的回合'];
export const CARD_NAME = {
    ALTER_FUTURE: 'alter_future',
    ANNOY: 'annoy',
    BLIND: 'blind',
    BOMB: 'bomb',
    DEFUSE: 'defuse',
    DRAW_BOTTOM: 'draw_bottom',
    FAKE_SHUFFLE: 'fake_shuffle',
    REVERSE: 'reverse',
    ROLL_CALL: 'roll_call',
    SEE_FUTURE: 'see_future',
    SELF_SLAP: 'self_slap',
    SHUFFLE: 'shuffle',
    SKIP: 'skip',
    SLAP: 'slap',
    STEAL: 'steal',
};
export const CARD_MAP = {
    '3001': {
        belong: [1, 2, 3],
        count: 1,
        intro: '摸到炸弹后, 6秒后爆炸, 使一名玩家淘汰.',
        intro_billbard: ['获得了炸弹狗', '解除了危机, 正在将此卡放入卡堆'],
        name: CARD_NAME.BOMB,
        name_zh: '炸弹',
        show_count: false,
        sound: 'bomb',
        type: CARD_NAME.BOMB,
    },
    '3101': {
        belong: [1, 2, 3],
        color: 1,
        count: 1,
        intro:
        '玩家抽到【炸弹狗】卡牌后,才可使用剪断引线. \n使用后,可决定【炸弹狗】卡牌放置的位置.',
        intro_billbard: ['使用了剪断引线\n正在布置炸弹狗', '炸弹狗布置完成'],
        name: CARD_NAME.DEFUSE,
        name_zh: '剪断引线',
        show_count: false,
        sound: 'defuse',
        type: CARD_NAME.DEFUSE,
    },
    '3201': {
        belong: [1, 2, 3],
        color: 2,
        count: 1,
        intro: '跳过摸牌阶段,结束本轮回合.',
        name: 'skip',
        name_zh: '跳过回合',
        show_count: false,
        sound: 'skip',
        type: 'skip',
    },
    '3301': {
        belong: [1, 2, 3],
        color: 3,
        count: 1,
        intro:
        '指定1名玩家,使该玩家立即进行1回合操作. \n附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: CARD_NAME.SLAP + 1,
        name_zh: '立即攻击',
        show_count: false,
        sound: 'slap',
        type: CARD_NAME.SLAP,
    },
    '3321': {
        belong: [1, 2, 3],
        color: 3,
        count: 2,
        intro:
        '指定1名玩家,使该玩家立即进行2回合操作. \n附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: CARD_NAME.SLAP + 2,
        name_zh: '立即攻击*2',
        show_count: false,
        sound: 'slap',
        type: CARD_NAME.SLAP,
    },
    '3331': {
        belong: [2],
        color: 3,
        count: 3,
        intro:
        '指定1名玩家,使该玩家立即进行3回合操作. \n附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: CARD_NAME.SLAP + 3,
        name_zh: '立即攻击*3',
        show_count: false,
        sound: 'slap',
        type: CARD_NAME.SLAP,
    },
    '3401': {
        belong: [1, 2, 3],
        color: 4,
        count: 1,
        intro: '选择1名玩家,被选中的玩家需要选择1张手牌给到使用【要牌】的玩家.',
        intro_billbard: ['使用要牌\n正在选择', '正在选择', '一张手牌'],
        name: CARD_NAME.STEAL,
        show_count: false,
        sound: 'steal',
        type: CARD_NAME.STEAL,
    },
    '3501': {
        belong: [2],
        color: 5,
        count: 1,
        intro: '查看牌堆里接下来的1张卡牌.',
        name: CARD_NAME.SEE_FUTURE + 1,
        name_zh: '偷看',
        show_count: true,
        sound: 'see_future',
        type: CARD_NAME.SEE_FUTURE,
    },
    '3521': {
        belong: [1, 2, 3],
        color: 5,
        count: 3,
        intro: '查看牌堆里接下来的3张卡牌.',
        name: CARD_NAME.SEE_FUTURE + 3,
        name_zh: '偷看*3',
        show_count: true,
        sound: 'see_future',
        type: CARD_NAME.SEE_FUTURE,
    },
    '3541': {
        belong: [2],
        color: 5,
        count: 5,
        intro: '查看牌堆里接下来的5张卡牌.',
        name: CARD_NAME.SEE_FUTURE + 5,
        name_zh: '偷看*5',
        show_count: true,
        sound: 'see_future',
        type: CARD_NAME.SEE_FUTURE,
    },
    '3601': {
        belong: [1, 2, 3],
        color: 6,
        count: 1,
        intro: '直接结束本轮回合,且出牌顺序反转.',
        name: CARD_NAME.REVERSE,
        name_zh: '反转',
        show_count: false,
        type: CARD_NAME.REVERSE,
    },
    '3701': {
        belong: [1, 2, 3],
        color: 10,
        count: 1,
        intro: '将牌堆中的卡牌顺序全部打乱.',
        name: CARD_NAME.SHUFFLE,
        name_zh: '洗牌',
        show_count: false,
        sound: 'shuffle',
        type: CARD_NAME.SHUFFLE,
    },
    '3801': {
        belong: [1, 2, 3],
        color: 8,
        count: 1,
        intro: '从牌堆底部抽1张卡牌,并结束本轮回合.',
        name: CARD_NAME.DRAW_BOTTOM,
        name_zh: '偷牌',
        show_count: false,
        sound: 'draw_bottom',
        type: CARD_NAME.DRAW_BOTTOM,
    },
    '3901': {
        belong: [2],
        color: 9,
        count: 1,
        intro:
        '将指定对手的手牌中随机1张暂时失效。\n对方只有在卡堆里抽一张卡才能解除干扰效果.',
        name: CARD_NAME.ANNOY + 1,
        name_zh: '干扰',
        show_count: true,
        sound: 'annoy',
        type: CARD_NAME.ANNOY,
    },
    '3921': {
        belong: [2],
        color: 9,
        count: 2,
        intro:
        '将指定对手的手牌中随机2张暂时失效。\n对方只有在卡堆里抽一张卡才能解除干扰效果.',
        name: CARD_NAME.ANNOY + 2,
        name_zh: '干扰*2',
        show_count: true,
        sound: 'annoy',
        type: CARD_NAME.ANNOY,
    },
    '4001': {
        belong: [2],
        color: 7,
        count: 1,
        intro:
        '将指定对手的手牌顺序全部遮蔽,并全部打乱。\n对方只能在卡堆里抽1卡才能解除干扰效果.',
        name: CARD_NAME.BLIND,
        name_zh: '致盲',
        show_count: false,
        sound: 'blind',
        type: CARD_NAME.BLIND,
    },
    '4101': {
        belong: [3],
        color: 5,
        count: 2,
        intro: '可以看到牌堆里顶部的2张牌,并且可以重新排布顺序.',
        name: CARD_NAME.ALTER_FUTURE + 2,
        intro_billbard: ['使用了出千*2', '已改变卡堆排序'],
        show_count: true,
        sound: 'alter_future',
        type: CARD_NAME.ALTER_FUTURE,
    },
    '4121': {
        belong: [3],
        color: 5,
        count: 3,
        intro: '可以看到牌堆里顶部的3张牌,并且可以重新排布顺序.',
        name: CARD_NAME.ALTER_FUTURE + 3,
        intro_billbard: ['使用了出千*3', '已改变卡堆排序'],
        show_count: true,
        sound: 'alter_future',
        type: CARD_NAME.ALTER_FUTURE,
    },
    '4141': {
        belong: [3],
        color: 5,
        count: 5,
        intro: '可以看到牌堆里顶部的5张牌,并且可以重新排布顺序.',
        name: CARD_NAME.ALTER_FUTURE + 5,
        intro_billbard: ['使用了出千*5', '已改变卡堆排序'],
        show_count: true,
        sound: 'alter_future',
        type: CARD_NAME.ALTER_FUTURE,
    },
    '4201': {
        belong: [3],
        color: 3,
        count: 2,
        intro:
        '让自己本回合可以操作2回合. \n附加属性:可以与【立即攻击】【双倍攻击】【三倍攻击】效果叠加.',
        name: CARD_NAME.SELF_SLAP + 2,
        name_zh: '再来一次*2',
        show_count: true,
        sound: 'slap',
        type: CARD_NAME.SELF_SLAP,
    },
    '4221': {
        belong: [3],
        color: 3,
        count: 3,
        intro:
        '让自己本回合可以操作3回合. \n附加属性:可以与【立即攻击】【双倍攻击】【三倍攻击】效果叠加.',
        name: CARD_NAME.SELF_SLAP + 3,
        name_zh: '再来一次*3',
        show_count: true,
        sound: 'slap',
        type: CARD_NAME.SELF_SLAP,
    },
    '4301': {
        belong: [3],
        color: 10,
        count: 1,
        intro: '将牌堆里的所有【炸弹狗】全部置顶.',
        name: CARD_NAME.ROLL_CALL,
        name_zh: '布置炸弹',
        show_count: false,
        sound: 'roll_call',
        type: CARD_NAME.ROLL_CALL,
    },
    '4401': {
        belong: [3],
        color: 10,
        count: 1,
        icon: 'shuffle',
        intro: `卡牌打出后, 获得卡堆里随机的一张卡牌.\n其他玩家在出牌区看到的都是使用了【洗牌】,实际上没有洗牌. `,
        name: CARD_NAME.FAKE_SHUFFLE,
        name_zh: '假装洗牌',
        show_count: false,
        sound: 'shuffle',
        type: CARD_NAME.FAKE_SHUFFLE,
    },
};

export const CARD_TYPE = {
    1: {
        name: '普通模式',
    },
    2: {
        name: '疯狂模式',
    },
    3: {
        name: '乱舞模式',
    },
};

//需要播放音效的技能
export const CARD_SOUND_LIST = ['alter_future1', 'alter_future2', 'annoy2', 'blind1', 'blind2',
    'defuse1', 'draw_bottom1', 'roll_call1', 'see_future1', 'bomb1',
    'shuffle1', 'skip1', 'steal1', 'steal2', 'steal3'];

//不需要提示的卡牌步骤
export const GUIDE_EXCLUDE = [
    '3101_2', '3301_1', '3321_1', '3321_2', '3331_1', '3331_2', '3401_1', '3901_1', '3921_1', '4001_1', '3201_1', '3601_1'
];


