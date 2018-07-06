import './sail/core/sail.core.js';
import './sail/core/sail.viewer.js';
import './sail/core/sail.utils.js';
import './sail/core/sail.io.js';
import './sail/core/sail.dialog.js';
import './sail/core/sail.director.js';
import './sail/core/sail.entrace.js';
import './sail/core/sail.scene.js';

import { CONFIG } from './data/config';
import { RESMAP } from './data/resMap';
import { load_util } from './mcTmpl/utils/load';
import './sail/lib/primus';
import './sail/tools/keyboard';
import './sail/tools/notify';
import { Hall } from './scene/hall/scene';
import { loadAssets } from './scene/loaing/main';
import { GameWrap } from './scene/game/sceneWrap';
import { CMD } from './data/cmd';
import './effect/scaleBtn';
import { detectModel } from './mcTmpl/utils/zutil';

Sail.onStart = () => {
    load_util.setResmap(RESMAP);
    if (detectModel('showStat')) {
        Laya.Stat.show();
    }
    Laya.SoundManager.setMusicVolume(0.4);
    Laya.SoundManager.autoStopMusic = true;
    Sail.keyboard = new Tools.KeyBoardNumber();

    Sail.io.init({
        publicKey: CONFIG.publick_key,
        token: CONFIG.token,
        type: 'primus',
        URL: CONFIG.websocket_url,
    });

    /** 监听用户状态， 是否在游戏中 */
    Sail.io.register(CMD.GET_USER_INFO, this, (data: UserData) => {
        let scene_class;
        if (Number(data.userStatus) === 0) {
            scene_class = Hall;
        } else {
            scene_class = GameWrap;
        }
        Sail.director.runScene(new scene_class());
        Sail.io.unregister(CMD.GET_USER_INFO);
    });
    Sail.io.emit(CMD.GET_USER_INFO);
};

Sail.run({
    BASE_PATH: CONFIG.cdn_url,
    DIALOGTYPE: 'multiple', // 弹窗模式 single:弹出弹窗时自动关闭其他弹窗, multiple : 允许弹出多层弹窗，可使用"closeOther:true"在弹出时关闭其他弹窗
    HEIGHT: 750,
    SCALE_MODE: Laya.Stage.SCALE_FIXED_WIDTH, // 自动横屏时选择:Laya.Stage.SCALE_FIXED_WIDTH  自动竖屏时选择:Laya.Stage.SCALE_FIXED_HEIGHT
    SCREEN_MODE: Laya.Stage.SCREEN_HORIZONTAL, // 可选自动横屏:Laya.Stage.SCREEN_HORIZONTAL 或者 自动竖屏:Laya.Stage.SCREEN_VERTICAL
    VERSION: CONFIG.cdn_version,
    WIDTH: 1334,
});
