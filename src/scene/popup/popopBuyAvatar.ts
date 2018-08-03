import { extend } from "../../mcTree/utils/zutil";

export class PopupBuyAvatar extends ui.popup.buy.buyAvatarUI {
    name = 'popup_buy_avatar';
    group = 'buy_avatar';
    constructor(remainTime) {
        super();
        this.init();
    }

    init() {

    }

    onOpened() {
        this.closeBtn.on(Laya.Event.CLICK, this, this.close);
        this.buyBtn.on(Laya.Event.CLICK, this, this.buy);
    }

    _close() {
        console.log(this.name + '---- _close');
        this.close();
    }

    buy() {
        console.log(this.name + '---- buy');

    }

    onClosed() {
        console.log(this.name + '---- onClosed');
        this.closeBtn.off(Laya.Event.CLICK, this, this.close);
    }
}

extend(PopupBuyAvatar, undefined, 'PopupBuyAvatar');