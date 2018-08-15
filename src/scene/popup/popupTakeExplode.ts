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
        this.ani.visible = true;
        this.ani.player.once(Laya.Event.COMPLETE, this, () => {
            this.ani.play('wait', true);
        });
    }
}