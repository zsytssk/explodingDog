import './sail/lib/primus';
import './sail/core/sail.core.js';
import './sail/core/sail.utils.js';
import './sail/core/sail.dialog.js';
import './sail/core/sail.scene.js';
import './sail/core/sail.director.js';
import './sail/core/sail.viewer.js';
import './sail/core/sail.io.js';
import './sail/core/sail.entrace.js';
import './sail/tools/keyboard';
import './sail/tools/notify';
import './effect/scaleBtn';

import { CONFIG } from './data/config';
import { Hall } from './scene/hall/scene';

Sail.onStart = function() {
    if (Sail.DEBUG) {
        Laya.Stat.show();
    }
    Laya.SoundManager.setMusicVolume(0.4);
    Laya.SoundManager.autoStopMusic = true;
    Sail.keyboard = new Tools.KeyBoardNumber();

    Sail.io.init({
        type: 'primus',
        URL: CONFIG.websocket_url,
        publicKey: CONFIG.publick_key,
        token: CONFIG.token,
    });
    Sail.director.runScene(new Hall());
};

Sail.run({
    WIDTH: 1334,
    HEIGHT: 750,
    SCREEN_MODE: Laya.Stage.SCREEN_HORIZONTAL, //可选自动横屏:Laya.Stage.SCREEN_HORIZONTAL 或者 自动竖屏:Laya.Stage.SCREEN_VERTICAL
    SCALE_MODE: Laya.Stage.SCALE_FIXED_WIDTH, //自动横屏时选择:Laya.Stage.SCALE_FIXED_WIDTH  自动竖屏时选择:Laya.Stage.SCALE_FIXED_HEIGHT
    BASE_PATH: CONFIG.cdn_url,
    DIALOGTYPE: 'multiple', //弹窗模式 single:弹出弹窗时自动关闭其他弹窗, multiple : 允许弹出多层弹窗，可使用"closeOther:true"在弹出时关闭其他弹窗
    VERSION: '02180620',
});
