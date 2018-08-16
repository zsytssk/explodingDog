import { tween } from "../../mcTree/utils/animate";
import { getSoundPath } from "../../utils/tool";

export class PopupTakeExplode extends ui.popup.popupTakeExplodeUI {
    name = 'popup_take_explode';
    group = 'exploding';
    CONFIG = {
        closeByGroup: true,
        autoClose: 5000
    }
    constructor() {
        super();
        this.init();
    }
    init() {
        this.bg.width = Laya.stage.width;
    }
    onOpened() {
        this.timerOnce(2000, this, () => {
            this.on(Laya.Event.CLICK, this, () => {
                this.close();
            });
        });
        let ani = new Laya.Skeleton();
        this.aniBox.addChild(ani);
        ani.load('animation/exploding.sk', new Laya.Handler(this, () => {
            ani.once(Laya.Event.STOPPED, this, () => {
                ani.play('wait', true);
            });
            ani.play('show', false);
        }));
    }
}