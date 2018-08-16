export class PopupTip extends ui.popup.popupTipUI {
    name = 'popup_tips';
    constructor(text) {
        super();
        this.zOrder = 10;
        this.tipLabel.text = text;
    }
}