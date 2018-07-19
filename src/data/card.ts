export const CARD_MAP = {
    '3001': {
        count: 1,
        name: 'exploding',
        show_count: false,
        type: 'exploding',
    },
    '3101': {
        count: 1,
        name: 'defuse',
        show_count: false,
        type: 'defuse',
    },
    '3201': {
        count: 1,
        name: 'skip',
        show_count: false,
        type: 'skip',
    },
    '3301': {
        count: 1,
        name: 'slap',
        show_count: false,
        type: 'slap',
    },
    '3321': {
        count: 2,
        name: 'double_slap',
        show_count: false,
        type: 'slap',
    },
    '3331': {
        count: 3,
        name: 'triple_slap',
        show_count: false,
        type: 'slap',
    },
    '3401': {
        count: 1,
        name: 'steal',
        show_count: false,
        type: 'steal',
    },
    '3501': {
        count: 1,
        name: 'see_the_future',
        show_count: true,
        type: 'see_the_future',
    },
    '3521': {
        count: 3,
        name: 'see_the_future',
        show_count: true,
        type: 'see_the_future',
    },
    '3541': {
        count: 5,
        name: 'see_the_future',
        show_count: true,
        type: 'see_the_future',
    },
    '3601': {
        count: 1,
        name: 'reverse',
        show_count: false,
        type: 'reverse',
    },
    '3701': {
        count: 1,
        name: 'shuffle',
        show_count: false,
        type: 'shuffle',
    },
    '3801': {
        count: 1,
        name: 'draw_from_the_bottom',
        show_count: false,
        type: 'draw_from_the_bottom',
    },
    '3901': {
        count: 1,
        name: 'annoy',
        show_count: true,
        type: 'annoy',
    },
    '3921': {
        count: 2,
        name: 'annoy',
        show_count: true,
        type: 'annoy',
    },
    '3931': {
        count: 3,
        name: 'annoy',
        show_count: true,
        type: 'annoy',
    },
    '4001': {
        count: 1,
        name: 'blind',
        show_count: false,
        type: 'blind',
    },
    '4101': {
        count: 2,
        name: 'alter_the_future',
        show_count: true,
        type: 'alter_the_future',
    },
    '4121': {
        count: 3,
        name: 'alter_the_future',
        show_count: true,
        type: 'alter_the_future',
    },
    '4141': {
        count: 5,
        name: 'alter_the_future',
        show_count: true,
        type: 'alter_the_future',
    },
    '4201': {
        count: 2,
        name: 'self_slap',
        show_count: true,
        type: 'self_slap',
    },
    '4221': {
        count: 3,
        name: 'self_slap',
        show_count: true,
        type: 'self_slap',
    },
    '4301': {
        count: 1,
        name: 'roll_call',
        show_count: false,
        type: 'roll_call',
    },
    '4401': {
        count: 1,
        name: 'fake_shuffle',
        show_count: false,
        type: 'fake_shuffle',
    },
};

export const TURN_CHANGE_ID = '0000';
export const CARD_DISCRIBE_MAP = {
    '3001': {
        icon: 'bomb',
        info: ['获得了炸弹', '解除了炸弹，正在将此卡放入卡堆'],
    },
    '3101': {
        icon: 'defuse',
        name: '剪断引线',
    },
    '3201': {
        icon: 'skip',
        name: '跳过回合',
    },
    '3301': {
        icon: 'alter',
        name: '移花接木',
    },
    '3321': {
        icon: 'alter',
        name: '移花接木X2',
    },
    '3331': {
        icon: 'alter',
        name: '移花接木X3',
    },
    '3401': {
        icon: 'steal',
        info: ['使用要牌\n正在选择', '使用了要牌', '正在选择', '一张手牌'],
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
        name: '釜底抽薪',
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
        name: '偷天换日X2',
    },
    '4121': {
        name: '偷天换日X3',
    },
    '4141': {
        name: '偷天换日X5',
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
