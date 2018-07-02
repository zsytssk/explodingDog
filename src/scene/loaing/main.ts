export function loadAssets() {
    return new Promise((resolve, reject) => {
        // Laya.loader.load();
    });
}

class LoadingUI extends ui.loading.mainUI {
    constructor() {
        super();
        this.init();
    }
    init() {

    }
}