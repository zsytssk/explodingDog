import { load_util } from '../../mcTmpl/utils/load';

export function loadAssets(name) {
    return load_util.load('loading').then(() => {
        load(name);
    });
}

function load(name) {
    const delay = 2000;
    const startTime = Date.parse(new Date());
    let loadingUI = new LoadingUI();
    Laya.stage.addChild(loadingUI);
    return load_util
        .load(name, progress => {
            loadingUI.updateProgrss(Math.floor(progress * 100));
        })
        .then(() => {
            const finishTime = Date.parse(new Date());
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
    init() {}
    updateProgrss(progress) {
        this.rateLabel.changeText(progress + '%');
    }
}
