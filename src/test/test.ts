import '../sail/core/sail.core.js';
import '../sail/core/sail.viewer.js';
import '../sail/core/sail.utils.js';
import '../sail/core/sail.io.js';
import '../sail/core/sail.dialog.js';
import '../sail/core/sail.director.js';
import '../sail/core/sail.entrace.js';
import '../sail/core/sail.scene.js';

import { CONFIG } from '../data/config.js';
import * as animate from '../mcTmpl/utils/animate.js';
import * as zutil from '../mcTmpl/utils/zutil.js';
import * as game from './game.js';

import * as server from './server.js';
import { default as token } from './token.json';
interface CusWindow extends Window {
    // load_util: typeof load_util;
    CONFIG: typeof CONFIG;
}

if (zutil.debugFE()) {
    const test = {};
    assign(test, [game, animate, zutil, server]);
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
