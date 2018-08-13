import { tween } from "../../mcTree/utils/animate";
import { getSoundPath } from "../../utils/tool";

export class PopupTakeExplode extends ui.popup.popupTakeExplodeUI {
    name = 'popup_take_explode';
    group = 'exploding';
    CONFIG = {
        closeByGroup: true
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
        Laya.SoundManager.playSound(getSoundPath('exploding'));
        this.ani.visible = true;
        this.ani.once(Laya.Event.STOPPED, this, () => {
            this.ani.play(1, true);
        })
        this.ani.play(0, false);
    }
}