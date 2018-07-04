import { CONFIG } from '../data/config';
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

    // tslint:disable-next-line:forin
    for (const key in game) {
        test[key] = game[key];
    }
    (window as CusWindow).load_util = load_util;
    (window as CusWindow).CONFIG = CONFIG;
    (window as any).test = game;
    Laya.Stat.show(0, 0);

    const user_id = Sail.Utils.getUrlParam('user_id');
    CONFIG.user_id = user_id;
    CONFIG.token = TEST_TOKEN[CONFIG.env][user_id];

    const test_scene = Sail.Utils.getUrlParam('scene');
    if (test_scene === 'game') {
        Sail.director.runScene(new GameWrap());
    }
}
