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
    }
    onOpened() {
        Laya.SoundManager.playSound(getSoundPath('exploding'));
    }
}