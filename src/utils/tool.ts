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

export function getAvatar(avatar_id) {
    return `images/component/avatar/${avatar_id}.png`;
}

export function isCurPlayer(user_id) {
    return user_id + '' === CONFIG.user_id;
}

/**
 * 将原始节点的位置 转化成目标节点的位置
 * @param pos ori_node中的位置
 * @param ori_node 开始所在的节点
 * @param end_node 目标的节点
 */
export function convertPos(
    pos: Laya.Point,
    ori_node: Laya.Sprite,
    end_node: Laya.Sprite,
) {
    ori_node.localToGlobal(pos);
    end_node.globalToLocal(pos);
    return pos;
}

/** 置灰的滤镜 */
export function getGrayFilter() {
    const data = [
        0.3,
        0.6094,
        0.082,
        0,
        0,
        0.3,
        0.6094,
        0.082,
        0,
        0,
        0.3,
        0.6094,
        0.082,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
    ];
    return new Laya.ColorFilter(data);
}

/** 整理gameReplay数据将当前用户的数据放到userList中， 且第一个 */
export function formatGameReplayData(data: GameReplayData) {
    const cur_user_info = data.curUserInfo;
    let user_list = data.userList;
    if (!user_list) {
        user_list = [];
    }
    for (let i = 0; i < user_list.length; i++) {
        if (user_list[i].userId === cur_user_info.userId) {
            user_list.splice(i, 1);
        }
    }
    user_list.unshift(cur_user_info);
    return {
        ...data,
        userList: user_list,
    };
}
export function formatUpdatePlayersData(data: UpdateUserData) {
    const user_list = data.userList;
    for (let i = 0; i < user_list.length; i++) {
        const item = user_list[i];
        if (isCurPlayer(item.userId)) {
            user_list.splice(i, 1);
            user_list.unshift(item);
        }
    }
    return {
        ...data,
        user_list,
    };
}

/** 停止骨骼动画, 如果是拖到页面上的 一开始无法停止 需要特殊处理` */
export function stopSkeleton(ani: Laya.Skeleton) {
    if (ani.player) {
        ani.stop();
        return;
    }
    ani.once(Laya.Event.PLAYED, ani, () => {
        setTimeout(() => {
            ani.stop();
        });
    });
}
/** 播放骨骼动画, 如果是拖到页面上的 一开始播放 需要特殊处理` */
export function playSkeleton(ani: Laya.Skeleton, ...params) {
    if (ani.player) {
        ani.play(...params);
        return;
    }
    ani.once(Laya.Event.PLAYED, ani, () => {
        setTimeout(() => {
            ani.play(...params);
        });
    });
}
