import { AppCtrl } from './app/app';
import { CONFIG } from './app/data/config';

function main() {
    initStage();
    const app = new AppCtrl();
    app.init();
    (window as CusWindow).app = app;
}
main();

function initStage() {
    // Laya.init(1334, 750); //初始化引擎
    Laya.init(1334, 750, Laya.WebGL); // 初始化引擎
    Laya.stage.frameRate = Laya.Stage.FRAME_FAST;
    Laya.SoundManager.autoReleaseSound = false;

    Laya.URL.basePath = CONFIG.cdn_url; // Laya 寻找图片的基本路劲
    Laya.URL.version = CONFIG.cdn_version; // 资源的版本
    Laya.stage.alignH = Laya.Stage.ALIGN_CENTER; // 横向居中
    Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE; // 竖向居中
    Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL; // 显示方式横屏

    /** 屏幕适配方式 */
    Laya.stage.scaleMode = CONFIG.scale_mode;
}
