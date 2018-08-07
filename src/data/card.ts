export const CARD_MAP = {
    '3001': {
        belong: [1, 2, 3],
        count: 1,
        intro: '摸到炸弹后, 6秒后爆炸, 使一名玩家淘汰.',
        name: 'exploding',
        show_count: false,
        type: 'exploding',
    },
    '3101': {
        belong: [1, 2, 3],
        color: 1,
        count: 1,
        intro:
            '玩家抽到【炸弹】卡牌后,才可使用剪断引线.使用后,可决定【炸弹】卡牌放置的位置.',
        name: 'defuse',
        show_count: false,
        type: 'defuse',
    },
    '3201': {
        belong: [1, 2, 3],
        color: 2,
        count: 1,
        intro: '跳过摸牌阶段,结束本轮回合.',
        name: 'skip',
        show_count: false,
        type: 'skip',
    },
    '3301': {
        belong: [1, 2, 3],
        color: 3,
        count: 1,
        intro:
            '指定1名玩家,使该玩家立即进行1回合操作.附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: 'slap1',
        show_count: false,
        type: 'slap',
    },
    '3321': {
        belong: [1, 2, 3],
        color: 3,
        count: 2,
        intro:
            '指定1名玩家,使该玩家立即进行2回合操作.附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: 'slap2',
        show_count: false,
        type: 'slap',
    },
    '3331': {
        belong: [1, 2, 3],
        color: 3,
        count: 3,
        intro:
            '指定1名玩家,使该玩家立即进行3回合操作.附加属性:将自己当前剩余操作回合转嫁给该玩家.',
        name: 'slap3',
        show_count: false,
        type: 'slap',
    },
    '3401': {
        belong: [1, 2, 3],
        color: 4,
        count: 1,
        intro: '选择1名玩家,被选中的玩家需要选1张手牌给到使用【要牌】的玩家.',
        name: 'steal',
        show_count: false,
        type: 'steal',
    },
    '3501': {
        belong: [2],
        color: 5,
        count: 1,
        intro: '查看牌堆里接下来的1张卡牌.',
        name: 'see_the_future1',
        show_count: true,
        type: 'see_the_future',
    },
    '3521': {
        belong: [1, 2, 3],
        color: 5,
        count: 3,
        intro: '查看牌堆里接下来的3张卡牌.',
        name: 'see_the_future3',
        show_count: true,
        type: 'see_the_future',
    },
    '3541': {
        belong: [2],
        color: 5,
        count: 5,
        intro: '查看牌堆里接下来的5张卡牌.',
        name: 'see_the_future5',
        show_count: true,
        type: 'see_the_future',
    },
    '3601': {
        belong: [1, 2, 3],
        color: 6,
        count: 1,
        intro: '直接结束本轮回合,且出牌顺序反转.',
        name: 'reverse',
        show_count: false,
        type: 'reverse',
    },
    '3701': {
        belong: [1, 2, 3],
        color: 7,
        count: 1,
        intro: '将牌堆中的卡牌顺序全部打乱.',
        name: 'shuffle',
        show_count: false,
        type: 'shuffle',
    },
    '3801': {
        belong: [1, 2, 3],
        color: 8,
        count: 1,
        intro: '从牌堆底部抽1张卡牌,并结束本轮回合.',
        name: 'draw_from_the_bottom',
        show_count: false,
        type: 'draw_from_the_bottom',
    },
    '3901': {
        belong: [2],
        color: 9,
        count: 1,
        intro:
            '将指定对手的手牌中随机1张暂时失效,对方只有在卡堆里抽一张卡才能解除干扰效果.',
        name: 'annoy1',
        show_count: true,
        type: 'annoy',
    },
    '3921': {
        belong: [2],
        color: 9,
        count: 2,
        intro:
            '将指定对手的手牌中随机2张暂时失效,对方只有在卡堆里抽一张卡才能解除干扰效果.',
        name: 'annoy2',
        show_count: true,
        type: 'annoy',
    },
    '4001': {
        belong: [2],
        color: 7,
        count: 1,
        intro:
            '先将指定对手的手牌顺序全部遮蔽,让对方看不到卡面,再全部打乱,对方只能在卡堆里抽1卡才能解除干扰效果.',
        name: 'blind',
        show_count: false,
        type: 'blind',
    },
    '4101': {
        belong: [3],
        color: 5,
        count: 2,
        intro: '可以看到牌堆里顶部的2张牌,并且可以重新排布顺序.',
        name: 'alter_the_future2',
        show_count: true,
        type: 'alter_the_future',
    },
    '4121': {
        belong: [3],
        color: 5,
        count: 3,
        intro: '可以看到牌堆里顶部的3张牌,并且可以重新排布顺序.',
        name: 'alter_the_future3',
        show_count: true,
        type: 'alter_the_future',
    },
    '4141': {
        belong: [3],
        color: 5,
        count: 5,
        intro: '可以看到牌堆里顶部的5张牌,并且可以重新排布顺序.',
        name: 'alter_the_future5',
        show_count: true,
        type: 'alter_the_future',
    },
    '4201': {
        belong: [3],
        color: 3,
        count: 2,
        intro:
            '让自己本回合可以操作2回合.附加属性:可以与【立即攻击】【双倍攻击】【三倍攻击】效果叠加.',
        name: 'self_slap2',
        show_count: true,
        type: 'self_slap',
    },
    '4221': {
        belong: [3],
        color: 3,
        count: 3,
        intro:
            '让自己本回合可以操作3回合.附加属性:可以与【立即攻击】【双倍攻击】【三倍攻击】效果叠加.',
        name: 'self_slap3',
        show_count: true,
        type: 'self_slap',
    },
    '4301': {
        belong: [3],
        color: 10,
        count: 1,
        intro: '将牌堆里的所有炸弹全部置顶.',
        name: 'roll_call',
        show_count: false,
        type: 'roll_call',
    },
    '4401': {
        belong: [3],
        color: 10,
        count: 1,
        intro: `卡牌打出后,所有人在出牌区看到的都是使用了【洗牌】,实际上没有洗牌.打出【假装洗牌】玩家本回合摸牌,获得卡堆里随机的一`,
        name: 'fake_shuffle',
        show_count: false,
        type: 'fake_shuffle',
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

export const TURN_CHANGE_ID = '0000';
export const CARD_DISCRIBE_MAP = {
    '3001': {
        icon: 'bomb',
        info: ['获得了炸弹', '解除了炸弹, 正在将此卡放入卡堆'],
    },
    '3101': {
        icon: 'defuse',
        info: ['使用了剪断引线\n正在布置炸弹', '布置了炸弹'],
    },
    '3201': {
        icon: 'skip',
        name: '跳过回合',
    },
    '3301': {
        icon: 'slap',
        name: '立即攻击',
    },
    '3321': {
        icon: 'slap',
        name: '立即攻击X2',
    },
    '3331': {
        icon: 'slap',
        name: '立即攻击X3',
    },
    '3401': {
        icon: 'steal',
        info: ['使用要牌\n正在选择', '正在选择', '一张手牌'],
    },
    '3501': {
        icon: 'future',
        name: '偷看',
    },
    '3521': {
        icon: 'future',
        name: '偷看X3',
    },
    '3541': {
        icon: 'future',
        name: '偷看X5',
    },
    '3601': {
        icon: 'reverse',
        name: '反转',
    },
    '3701': {
        icon: 'shuffle',
        name: '洗牌',
    },
    '3801': {
        icon: 'bottom',
        name: '偷牌',
    },
    '3901': {
        icon: 'annoy',
        name: '干扰',
    },
    '3921': {
        icon: 'annoy',
        name: '干扰X2',
    },
    '3931': {
        icon: 'annoy',
        name: '干扰X3',
    },
    '4001': {
        icon: 'blind',
        name: '致盲',
    },
    '4101': {
        name: '出千X2',
    },
    '4121': {
        name: '出千X3',
    },
    '4141': {
        name: '出千X5',
    },
    '4201': {
        icon: 'self_slap',
        name: '再来一次X2',
    },
    '4221': {
        icon: 'self_slap',
        name: '再来一次X3',
    },
    '4301': {
        name: '同归于尽',
    },
    '4401': {
        icon: 'shuffle',
        name: '假装洗牌',
    },
    [TURN_CHANGE_ID]: {
        info: ['的回合'],
    },
};
