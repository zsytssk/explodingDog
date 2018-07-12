import { CARD_MAP } from '../data/card';
import { CONFIG } from '../data/config';
import { logErr } from '../mcTree/utils/zutil';

export function callFunc(func) {
    if (!isFunc(func)) {
        return;
    }
    func();
}

export function isFunc(func): boolean {
    return func && typeof func === 'function';
}

export function splitPath(path) {
    const arr = path.split('/');
    while (true) {
        if (arr[0] === '') {
            arr.shift();
        }
        break;
    }
    return arr;
}
export function delArrSameItem<T>(arr1: T[], arr2: T[]): T[][] {
    let same_num = 0;
    for (let len = arr1.length, i = 0; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
            break;
        }
        same_num++;
    }
    arr1.splice(0, same_num);
    arr2.splice(0, same_num);
    return [arr1, arr2];
}

export function checkLogin() {
    if (GM && GM.userLogged) {
        return true;
    }
    location.href = GM.userLoginUrl;
    return false;
}
/** 通过value 来找到obj的key */
export function getKeyByValue(obj: AnyObj, val) {
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        if (obj[key] === val) {
            return key;
        }
    }
}

export function getCardInfo(card_id) {
    const card_data = CARD_MAP[card_id];
    if (!card_data) {
        /* '*'是其他玩家的牌 */
        if (card_id !== '*') {
            logErr(`cant find card_info for ${card_id}`);
        }
        return;
    }
    if (typeof card_data === 'string') {
        return {
            url: `images/game/card/${card_data}.png`,
        };
    }
    const name = card_data.name;
    return {
        ...card_data,
        url: `images/game/card/${name}.png`,
    };
}

export function isCurPlayer(user_id) {
    return user_id + '' === CONFIG.user_id;
}
