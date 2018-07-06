import { CONFIG } from '../data/config';
import * as animate from '../mcTmpl/utils/animate';
import * as zutil from '../mcTmpl/utils/zutil';
// import { load_util } from '../mcTmpl/utils/load';
import * as game from './game';
import * as server from './server';
import { default as token } from './token.json';
interface CusWindow extends Window {
    // load_util: typeof load_util;
    CONFIG: typeof CONFIG;
}

if (zutil.debugFE()) {
    const test = {};
    assign(test, [game, animate, zutil, server]);
    // (window as CusWindow).load_util = load_util;
    (window as CusWindow).CONFIG = CONFIG;
    (window as any).test = test;

    const user_id = zutil.detectModel('user_id');
    CONFIG.user_id = user_id;
    CONFIG.token = token[user_id];
}

function assign(obj_ori, objs_end) {
    for (const obj_end of objs_end) {
        Object.assign(obj_ori, obj_end);
    }
}
