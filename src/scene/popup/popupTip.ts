export class PopupTip extends ui.popup.popupTipUI {
    constructor(text) {
        super();
        this.zOrder = 10;
        this.tipLabel.changeText(text);
    }
}