import './sail/core/sail.core.js';
import './sail/core/sail.viewer.js';
import './sail/core/sail.utils.js';
import './sail/core/sail.io.js';
import './sail/core/sail.dialog.js';
import './sail/core/sail.director.js';
import './sail/core/sail.entrace.js';
import './sail/core/sail.scene.js';

import { CONFIG } from './data/config.js';
import { RESMAP } from './data/resMap.js';
import { load_util } from './mcTmpl/utils/load.js';
import './sail/lib/primus.js';
import './sail/tools/keyboard.js';
import './sail/tools/notify.js';
import { Hall } from './scene/hall/scene.js';
import { loadAssets } from './scene/loaing/main.js';

import './effect/scaleBtn.js';
import { detectModel } from './mcTmpl/utils/zutil.js';

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
    loadAssets('hall').then(() => {
        Sail.director.runScene(new Hall());
    });
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
