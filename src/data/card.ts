export const TURN_CHANGE_ID = '0000';
export const CARD_MAP = {
    [TURN_CHANGE_ID]: {
        intro_billbard: ['的回合'],
    },
    '3001': {
        belong: [1, 2, 3],
        count: 1,
        intro: '摸到炸弹后, 6秒后爆炸, 使一名玩家淘汰.',
        intro_billbard: ['获得了炸弹', '解除了炸弹, 正在将此卡放入卡堆'],
        name: 'bomb',
        name_zh: '炸弹',
        show_count: false,
        type: 'bomb',
        sound: 'bomb'
    },
    '3101': {
        belong: [1, 2, 3],
        color: 1,
        count: 1,
        icon: 'defuse',
        intro:
            '玩家抽到【炸弹】卡牌后,才可使用剪断引线.使用后,可决定【炸弹】卡牌放置的位置.',
        intro_billbard: ['使用了剪断引线\n正在布置炸弹', '布置了炸弹'],
        name: 'defuse',
        name_zh: '剪断引线',
        show_count: false,
        type: 'defuse',
        sound: 'defuse'
    },
    '3201': {
        belong: [1, 2, 3],
        color: 2,
        count: 1,
        intro: '跳过摸牌阶段,结束本轮回合.',
        name: 'skip',
        name_zh: '跳过回合',
        show_count: false,
        type: 'skip',
        sound: 'skip'
    },
    '3301': {
        belong: [1, 2, 3],
        color: 3,
        count: 1,
        intro:
            '指定1名玩家,使该玩家立即进行1回合操作.附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: 'slap1',
        name_zh: '立即攻击',
        show_count: false,
        type: 'slap',
        sound: 'slap'
    },
    '3321': {
        belong: [1, 2, 3],
        color: 3,
        count: 2,
        intro:
            '指定1名玩家,使该玩家立即进行2回合操作.附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: 'slap2',
        name_zh: '立即攻击X2',
        show_count: false,
        type: 'slap',
        sound: 'slap'
    },
    '3331': {
        belong: [2],
        color: 3,
        count: 3,
        intro:
            '指定1名玩家,使该玩家立即进行3回合操作.附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: 'slap3',
        name_zh: '立即攻击X3',
        show_count: false,
        type: 'slap',
        sound: 'slap'
    },
    '3401': {
        belong: [1, 2, 3],
        color: 4,
        count: 1,
        intro: '选择1名玩家,被选中的玩家需要选1张手牌给到使用【要牌】的玩家.',
        intro_billbard: ['使用要牌\n正在选择', '正在选择', '一张手牌'],
        name: 'steal',
        show_count: false,
        type: 'steal',
        sound: 'steal'
    },
    '3501': {
        belong: [2],
        color: 5,
        count: 1,
        intro: '查看牌堆里接下来的1张卡牌.',
        name: 'see_future1',
        name_zh: '偷看',
        show_count: true,
        type: 'see_future',
        sound: 'see_future'
    },
    '3521': {
        belong: [1, 2, 3],
        color: 5,
        count: 3,
        intro: '查看牌堆里接下来的3张卡牌.',
        name: 'see_future3',
        name_zh: '偷看X3',
        show_count: true,
        type: 'see_future',
        sound: 'see_future'
    },
    '3541': {
        belong: [2],
        color: 5,
        count: 5,
        intro: '查看牌堆里接下来的5张卡牌.',
        name: 'see_future5',
        name_zh: '偷看X5',
        show_count: true,
        type: 'see_future',
        sound: 'see_future'
    },
    '3601': {
        belong: [1, 2, 3],
        color: 6,
        count: 1,
        intro: '直接结束本轮回合,且出牌顺序反转.',
        name: 'reverse',
        name_zh: '反转',
        show_count: false,
        type: 'reverse',
    },
    '3701': {
        belong: [1, 2, 3],
        color: 10,
        count: 1,
        intro: '将牌堆中的卡牌顺序全部打乱.',
        name: 'shuffle',
        name_zh: '洗牌',
        show_count: false,
        type: 'shuffle',
        sound: 'shuffle'
    },
    '3801': {
        belong: [1, 2, 3],
        color: 8,
        count: 1,
        intro: '从牌堆底部抽1张卡牌,并结束本轮回合.',
        name: 'draw_bottom',
        name_zh: '偷牌',
        show_count: false,
        type: 'draw_bottom',
        sound: 'draw_bottom'
    },
    '3901': {
        belong: [2],
        color: 9,
        count: 1,
        intro:
            '将指定对手的手牌中随机1张暂时失效,对方只有在卡堆里抽一张卡才能解除干扰效果.',
        name: 'annoy1',
        name_zh: '干扰',
        show_count: true,
        type: 'annoy',
        sound: 'annoy'
    },
    '3921': {
        belong: [2],
        color: 9,
        count: 2,
        intro:
            '将指定对手的手牌中随机2张暂时失效,对方只有在卡堆里抽一张卡才能解除干扰效果.',
        name: 'annoy2',
        name_zh: '干扰X2',
        show_count: true,
        type: 'annoy',
        sound: 'annoy'
    },
    '4001': {
        belong: [2],
        color: 7,
        count: 1,
        intro:
            '先将指定对手的手牌顺序全部遮蔽,让对方看不到卡面,再全部打乱,对方只能在卡堆里抽1卡才能解除干扰效果.',
        name: 'blind',
        name_zh: '致盲',
        show_count: false,
        type: 'blind',
        sound: 'blind'
    },
    '4101': {
        belong: [3],
        color: 5,
        count: 2,
        intro: '可以看到牌堆里顶部的2张牌,并且可以重新排布顺序.',
        name: 'alter_future2',
        name_zh: '出千X2',
        show_count: true,
        type: 'alter_future',
        sound: 'alter_future'
    },
    '4121': {
        belong: [3],
        color: 5,
        count: 3,
        intro: '可以看到牌堆里顶部的3张牌,并且可以重新排布顺序.',
        name: 'alter_future3',
        name_zh: '出千X3',
        show_count: true,
        type: 'alter_future',
        sound: 'alter_future'
    },
    '4141': {
        belong: [3],
        color: 5,
        count: 5,
        intro: '可以看到牌堆里顶部的5张牌,并且可以重新排布顺序.',
        name: 'alter_future5',
        name_zh: '出千X5',
        show_count: true,
        type: 'alter_future',
        sound: 'alter_future'
    },
    '4201': {
        belong: [3],
        color: 3,
        count: 2,
        intro:
            '让自己本回合可以操作2回合.附加属性:可以与【立即攻击】【双倍攻击】【三倍攻击】效果叠加.',
        name: 'self_slap2',
        name_zh: '再来一次X2',
        show_count: true,
        type: 'self_slap',
        sound: 'slap'
    },
    '4221': {
        belong: [3],
        color: 3,
        count: 3,
        intro:
            '让自己本回合可以操作3回合.附加属性:可以与【立即攻击】【双倍攻击】【三倍攻击】效果叠加.',
        name: 'self_slap3',
        name_zh: '再来一次X3',
        show_count: true,
        type: 'self_slap',
        sound: 'slap'
    },
    '4301': {
        belong: [3],
        color: 10,
        count: 1,
        intro: '将牌堆里的所有炸弹全部置顶.',
        name: 'roll_call',
        name_zh: '布置炸弹',
        show_count: false,
        type: 'roll_call',
        sound: 'roll_call'
    },
    '4401': {
        belong: [3],
        color: 10,
        count: 1,
        icon: 'shuffle',
        intro: `卡牌打出后,所有人在出牌区看到的都是使用了【洗牌】,实际上没有洗牌.打出【假装洗牌】玩家本回合摸牌,获得卡堆里随机的一`,
        name: 'fake_shuffle',
        name_zh: '假装洗牌',
        show_count: false,
        type: 'fake_shuffle',
        sound: 'shuffle'
    },
};

export const CARD_TYPE = {
    1: {
        name: '普通卡组',
    },
    2: {
        name: '疯狂扩展包',
    },
    3: {
        name: '乱舞扩展包',
    },
};
