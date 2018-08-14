import { getCardInfo } from '../utils/tool';

/** 获得卡牌星星的颜色  */
const CARD_STAR_COLOR = {
    1: 'green',
    2: 'blue',
    3: 'red',
    4: 'grey',
    5: 'pink',
    6: 'purple',
    7: 'red',
    8: 'brown',
    9: 'brown',
    10: 'blue',
};

/** 通过card_id获得星星的颜色 */
export function getCardStarColor(card_id) {
    const card_info = getCardInfo(card_id);
    const color = card_info.color;
    if (!color) {
        return;
    }
    return CARD_STAR_COLOR[color + ''];
}
