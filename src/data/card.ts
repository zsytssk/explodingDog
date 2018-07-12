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
        name: 'anooy',
        show_count: true,
        type: 'anooy',
    },
    '3921': {
        count: 2,
        name: 'anooy',
        show_count: true,
        type: 'anooy',
    },
    '3931': {
        count: 3,
        name: 'anooy',
        show_count: true,
        type: 'anooy',
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


export const CARD_DISCRIBE_MAP = {
    'turn': {
        info: ['的回合']
    },
    '3001': {
        info: ['获得了炸弹', '解除了炸弹，正在将此卡放入卡堆'],
        icon: 'bomb'
    },
    '3101': {
        name: '剪断引线',
        icon: 'defuse'
    },
    '3201': {
        name: '跳过回合',
        icon: 'skip'
    },
    '3301': {
        name: '移花接木',
        icon: 'alter'
    },
    '3321': {
        name: '移花接木X2',
        icon: 'alter'
    },
    '3331': {
        name: '移花接木X3',
        icon: 'alter'
    },
    '3401': {
        info: ['使用要牌\n正在选择', '使用了要牌', '正在选择', '一张手牌'],
        icon: 'steal'
    },
    '3501': {
        name: '偷看',
        icon: 'future'
    },
    '3521': {
        name: '偷看X3',
        icon: 'future'
    },
    '3541': {
        name: '偷看X5',
        icon: 'future'
    },
    '3601': {
        name: '反转',
        icon: 'reverse'
    },
    '3701': {
        name: '洗牌',
        icon: 'shuffle'
    },
    '3801': {
        name: '釜底抽薪',
        icon: 'bottom'
    },
    '3901': {
        name: '干扰',
        icon: 'annoy'
    },
    '3921': {
        name: '干扰X2',
        icon: 'annoy'
    },
    '3931': {
        name: '干扰X3',
        icon: 'annoy'
    },
    '4001': {
        name: '致盲',
        icon: 'blind'
    },
    '4101': {
        name: '偷天换日X2'
    },
    '4121': {
        name: '偷天换日X3'
    },
    '4141': {
        name: '偷天换日X5'
    },
    '4201': {
        name: '再来一次X2',
        icon: 'self_slap'
    },
    '4221': {
        name: '再来一次X3',
        icon: 'self_slap'
    },
    '4301': {
        name: '同归于尽'
    },
    '4401': {
        name: '假装洗牌',
        icon: 'shuffle'
    },
};
