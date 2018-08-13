
import { GuideStep } from "./guideStep";
import { GuideStart } from "./guideStart";
import { fade_out, fade_in } from "../../mcTree/utils/animate";
import { loadAssets } from "../loading/main";
import { Hall } from "../hall/scene";
import { CMD } from "../../data/cmd";
import { BgCtrl } from "../component/bgCtrl";
import { log } from "../../mcTree/utils/zutil";

export class GuideView extends ui.guide.mainUI {
    private stepUI;
    private startUI;
    constructor() {
        super();
        this.init();
    }
    init() {
        new BgCtrl(this.bg).init();
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
                this.stepUI.setStep(1);
            });
        });
        this.startUI.btn_end.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.FINISH_GUIDE);
            loadAssets('hall').then(() => {
                Sail.director.runScene(new Hall());
            })
        });
        this.stepUI.on(this.stepUI.FINISH, this, () => {
            fade_out(this.stepUI).then(() => {
                fade_in(this.startUI, 50);
                this.startUI.setType('end');
            });
        })
    }
}

