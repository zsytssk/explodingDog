import { tween } from "../../mcTree/utils/animate";

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
    }
    onOpened() {
        this.bomb.visible = true;
        tween({
            sprite: this.bomb,
            start_props: { scaleX: 0, scaleY: 0 },
            end_props: { scaleX: 1, scaleY: 1 },
            time: 500,
            ease_fn: Laya.Ease.elasticOut
        });
    }
}