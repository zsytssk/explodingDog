import { CMD } from "../../data/cmd";

export class PopupDaily extends ui.popup.popupDailyUI {
    constructor(data) {
        super();
        this.initEvent();
        this.setAmount(data);
    }
    setAmount(data) {
        this.amount.text = data
    }
    initEvent() {
        this.btn_get.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.GET_DAILY_AWARDS);
        });
    }
}