console.log(5);
import { load_util } from './utils/load';
import { HallCtrl } from './app/scene/hall/main';
import { detectModel } from './utils/zutil';

interface CusWindow extends Window {
    load_util: typeof load_util;
}
if (detectModel('showStat')) {
    Laya.Stat.show(0, 0);
}
(window as CusWindow).load_util = load_util;

const hall = new HallCtrl();
app.addChild(hall);
hall.init();
hall.enter();
