import { PopupBuyCardType } from '../popupBuyCardType';
import { CardPackCtrl, CardTypeData } from './cardPackBase';

export class CardPackShop extends ui.popup.component.cardPackShopUI {
    constructor(data: CardTypeData) {
        super();
        this.init(data);
    }

    protected init(data: CardTypeData) {
        const { pack_base, cost, btn_buy, btn_success } = this;
        const { price, is_buy } = data;

        const card_pack_ctrl = new CardPackCtrl(
            pack_base,
            data,
            this.onBuySucess,
        );
        card_pack_ctrl.init();
        if (is_buy) {
            this.onBuySucess();
            return;
        }

        cost.text = price + '';
        btn_buy.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(
                new PopupBuyCardType(data, this.onBuySucess),
            );
        });
    }
    private onBuySucess = () => {
        this.btn_buy.visible = false;
        this.btn_success.visible = true;
    };
}
