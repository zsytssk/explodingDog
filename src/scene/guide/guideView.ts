
import { GuideStep } from "./guideStep";
import { GuideStart } from "./guideStart";
import { fade_out, fade_in } from "../../mcTree/utils/animate";

export class GuideView extends ui.guide.mainUI {
    private stepUI;
    private startUI;
    constructor() {
        super();
        this.init();
    }
    init() {
        this.stepUI = new GuideStep();
        this.stepUI.visible = false;
        this.startUI = new GuideStart();
        this.startUI.setType('start');
        this.addChildren(this.stepUI, this.startUI);
        this.initEvent();
    }
    initEvent() {
        this.startUI.btn_continue.on(Laya.Event.CLICK, this, () => {
            fade_out(this.startUI).then(() => {
                fade_in(this.stepUI, 50);
            });
        });

    }
}

