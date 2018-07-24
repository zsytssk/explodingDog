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
}