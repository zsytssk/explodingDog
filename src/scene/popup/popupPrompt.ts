export class PopupPrompt extends ui.popup.popupPromptUI {
    constructor(text, callback) {
        super();
        this.init(text, callback)
    }
    init(text, callback) {
        this.tipLabel.changeText(text);
        if (typeof callback == 'function') {
            this.btnEnsure.on(Laya.Event.CLICK, this, callback);
        }
    }
}