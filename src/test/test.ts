import '../sailImport';
import { CONFIG } from '../data/config';
import * as animate from '../mcTree/utils/animate';
import * as zutil from '../mcTree/utils/zutil';
import * as tool from '../utils/tool';
import * as game from './game';
import * as animateTest from './animate';

import * as server from './server';
import { default as token } from './token.json';
interface CusWindow extends Window {
    // load_util: typeof load_util;
    CONFIG: typeof CONFIG;
}

if (zutil.debugFE()) {
    const test = {};
    assign(test, [game, animateTest, animate, zutil, server, tool]);
    (window as CusWindow).CONFIG = CONFIG;
    (window as any).test = test;

    const user_id = zutil.detectModel('user_id');
    if (user_id) {
        CONFIG.user_id = user_id;
        CONFIG.token = token[user_id];
    }
}

function assign(obj_ori, objs_end) {
    for (const obj_end of objs_end) {
        Object.assign(obj_ori, obj_end);
    }
}
