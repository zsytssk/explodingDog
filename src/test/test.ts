import { CONFIG } from '../data/config';
import { load_util } from '../utils/load';
import { TEST_TOKEN } from './testToken';

interface CusWindow extends Window {
    load_util: typeof load_util;
    CONFIG: typeof CONFIG;
}

if (Sail.DEBUG) {
    (window as CusWindow).load_util = load_util;
    (window as CusWindow).CONFIG = CONFIG;
    Laya.Stat.show(0, 0);

    const user_id = Sail.Utils.getUrlParam('user_id');
    CONFIG.user_id = user_id;
    CONFIG.token = TEST_TOKEN[CONFIG.env][user_id];
}
