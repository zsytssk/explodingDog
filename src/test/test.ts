import { CONFIG } from '../data/config';
import * as animate from '../mcTmpl/utils/animate';
import { load_util } from '../mcTmpl/utils/load';
import { GameWrap } from '../scene/game/sceneWrap';
import * as game from './game';
import { TEST_TOKEN } from './testToken';
interface CusWindow extends Window {
    load_util: typeof load_util;
    CONFIG: typeof CONFIG;
}

if (Sail.DEBUG) {
    const test = {};

    assign(test, [game, animate]);
    (window as CusWindow).load_util = load_util;
    (window as CusWindow).CONFIG = CONFIG;
    (window as any).test = test;
    Laya.Stat.show(0, 0);

    const user_id = Sail.Utils.getUrlParam('user_id');
    CONFIG.user_id = user_id;
    CONFIG.token = TEST_TOKEN[CONFIG.env][user_id];

    const test_scene = Sail.Utils.getUrlParam('scene');
    if (test_scene === 'game') {
        Sail.director.runScene(new GameWrap());
    }
}

function assign(obj_ori, objs_end) {
    for (const obj_end of objs_end) {
        Object.assign(obj_ori, obj_end);
    }
    // tslint:disable-next-line:forin
    // for (const key in obj_end) {
    //     obj_ori[key] = obj_end[key];
    // }
}
