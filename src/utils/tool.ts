import { random } from 'lodash';
import { CARD_MAP, CARD_TYPE } from '../data/card';
import { CONFIG } from '../data/config';
import { logErr, log, getQueryString, getUri } from '../mcTree/utils/zutil';

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
        return {};
    }
    if (typeof card_data === 'string') {
        return {
            url: `images/component/card/${card_data}.png`,
        };
    }
    const name = card_data.name;
    let icon = card_data.icon || card_data.type;
    if (icon) {
        icon = 'icon_' + icon;
    }

    return {
        ...card_data,
        icon,
        url: `images/component/card/${name}.png`,
    };
}

export function getAvatar(avatar_id) {
    return `images/component/avatar/${avatar_id}.png`;
}

export function getSoundPath(name) {
    return `sound/${name}.mp3`;
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
export function getFilter(type: string) {
    let data;
    if (type === 'black') {
        data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    }
    return new Laya.ColorFilter(data);
}

/** 整理gameReplay数据将当前用户的数据放到userList中， 且第一个 */
export function formatGameReplayData(data: GameReplayData) {
    let user_list = [];
    const { userList, ...other } = data;
    if (!userList) {
        user_list = [];
    }
    for (const key in userList) {
        if (!userList.hasOwnProperty(key)) {
            continue;
        }
        if (isCurPlayer(key)) {
            user_list.unshift(userList[key]);
        } else {
            user_list.push(userList[key]);
        }
    }
    return {
        ...other,
        userList: user_list,
    };
}
export function formatUpdatePlayersData(data: UpdateUserData) {
    let user_list = [];
    const { userList, ...other } = data;
    if (!userList) {
        user_list = [];
    }
    for (const key in userList) {
        if (!userList.hasOwnProperty(key)) {
            continue;
        }
        if (isCurPlayer(key)) {
            user_list.unshift(userList[key]);
        } else {
            user_list.push(userList[key]);
        }
    }
    return {
        ...other,
        userList: user_list,
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
type Params = [any, boolean, boolean?, number?, number?, boolean?];

export function playSkeleton(ani: Laya.Skeleton, ...params: Params) {
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

/** 角度转化为弧度 */
export function degreeToAngle(degrees) {
    return (degrees * Math.PI) / 180;
}
/** 弧度转化为角度 */
export function angleTodegree(angle) {
    return (angle * 180) / Math.PI;
}

export function popupFadeInEffect(dialog) {
    return new Laya.Handler(dialog, () => {
        dialog.scale(1, 1);
        dialog.alpha = 0;
        Laya.Tween.to(
            dialog,
            {
                alpha: 1,
            },
            150,
            Laya.Ease.linearNone,
            Laya.Handler.create(
                this,
                Sail.director.dialog.doOpen.bind(Sail.director.dialog),
                [dialog],
            ),
        );
    });
}
export function popupFadeOutEffect(dialog) {
    return new Laya.Handler(dialog, () => {
        dialog.alpha = 1;
        Laya.Tween.to(
            dialog,
            {
                alpha: 0,
            },
            150,
            Laya.Ease.linearNone,
            Laya.Handler.create(
                this,
                Sail.director.dialog.doClose.bind(Sail.director.dialog),
                [dialog],
            ),
        );
    });
}
/** 将一个长字符串换行 */
export function splitStr(str: string, line_char_num: number) {
    const char2_reg = new RegExp(/[^\x00-\xff]/);
    let result = '';
    let num = 0;
    for (const char of str) {
        result += char;
        if (char === '\n') {
            num = 0;
            continue;
        }
        if (char2_reg.test(char)) {
            num += 2;
        } else {
            num++;
        }
        if (num >= line_char_num) {
            num = 0;
            result += '\n';
        }
    }
    return result;
}
/** 生成一个随机的card_id */
export function randomCardId() {
    const key_arr = [];
    for (const key in CARD_MAP) {
        if (!CARD_MAP.hasOwnProperty(key)) {
            continue;
        }
        key_arr.push(key);
    }
    return key_arr[random(0, key_arr.length)];
}
/** 获取牌所属卡包字符串 */
export function getBlongStr(belong: number[]) {
    let result = '';
    for (const type of belong) {
        result += CARD_TYPE[type].name + ' ';
    }
    result += '\n中出现.';
    return result;
}

export function hasShareToWx() {
    let has = (window as any).PAG_JS && (window as any).PAG_JS.shareToWX;
    if (has) {
        return true;
    }
    has = (window as any).wltgame && (window as any).wltgame.shareToWX;
    if (has) {
        return true;
    }
    return false;
}
export function shareToWx(
    title: string,
    desc: string,
    img_url: string,
    link: string,
) {
    alert(link);
    const share_fun =
        (window as any).Client &&
        ((window as any).Client.shareDocToWX as FuncVoid);
    if (!share_fun) {
        return;
    }
    share_fun(1, title, desc, img_url, link);
}
/** 复制文本 */

export function browserSupportCopy() {
    if (document && document.execCommand) {
        return true;
    }
    return false;
}

let textArea;
export function copy(txt) {
    textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '-100px';
    textArea.style.left = '-100px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0px';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = txt;
    document.body.appendChild(textArea);
    textArea.select();
}
document.querySelector('body').addEventListener('touchend', () => {
    setTimeout(() => {
        if (!textArea) {
            return;
        }
        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            log('Copying text command was ' + msg);
        } catch (err) {
            log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
        textArea = undefined;
    }, 10);
});

export function getRoomId() {
    const hash = location.hash.replace('#', '');
    if (!hash) {
        return;
    }
    const query = getQueryString(hash) as AnyObj;
    return query.room_id;
}
export function resetRoomId() {
    let hash = location.hash.replace('#', '');
    if (!hash) {
        return;
    }
    const query = getQueryString(hash) as AnyObj;
    query.room_id = '';

    hash = getUri(query);
    location.href = location.href.replace(location.hash, '#' + hash);
}

const templet_pool: {
    [key: string]: Laya.Templet;
} = {};
/**
 * 创建骨骼, 通过传过来的动画名称去animate文件夹下寻找动画文件
 * @param name 动画的名称, 用来定位动画文件
 */
export function createSkeleton(name: string): laya.ani.bone.Skeleton {
    let templet: Laya.Templet;
    if (templet_pool[name]) {
        templet = templet_pool[name];
    } else {
        templet = new Laya.Templet();
        templet.parseData(
            Laya.loader.getRes('animation/' + name + '.png'),
            Laya.loader.getRes('animation/' + name + '.sk'),
            24,
        );
        templet_pool[name] = templet;
    }

    return templet.buildArmature(0);
}
