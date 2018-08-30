import { load_util } from '../../mcTree/utils/load';
import { BgCtrl } from '../component/bgCtrl';
import { log } from '../../mcTree/utils/zutil';

export async function loadAssets(name) {
    // await load_util.load('loading');
    return await load(name);
}

function load(name) {
    const delay = 2000;
    const startTime = Date.now();
    const loadingUI = new LoadingUI();
    Laya.stage.addChild(loadingUI);
    return load_util
        .load(name, progress => {
            loadingUI.updateProgrss(progress);
        })
        .then(() => {
            const finishTime = Date.now();
            if (finishTime - startTime < delay) {
                setTimeout(() => {
                    loadingUI.destroy();
                }, delay);
            } else {
                loadingUI.destroy();
            }
        });
}

class LoadingUI extends ui.loading.mainUI {
    constructor() {
        super();
        this.init();
    }
    init() {
        const bg_ctrl = new BgCtrl(this.bg);
        bg_ctrl.init();
        if (
            GM.gamePublishInfo &&
            (window as CusWindow).laya &&
            laya.components &&
            laya.components.Isbn
        ) {
            var isbn = new laya.components.Isbn();
            this.addChild(isbn);
        }
        this.progressDog.scrollRect = new Laya.Rectangle(0, 0, 303, 407);
    }
    updateProgrss(progress) {
        this.rateLabel.changeText(Math.floor(progress * 100) + '%');
        // .anchorY = 1 - progress;
        Laya.Tween.clearAll(this);
        Laya.Tween.to(this.progressDog, { anchorY: 1 - progress }, 300);
    }
}
