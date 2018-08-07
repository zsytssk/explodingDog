import { CMD } from '../../../data/cmd';
import { CardPackCtrl } from './cardPackBase';
import { log } from '../../../mcTree/utils/zutil';
import { PopupPrompt } from '../popupPrompt';
import { PopupBuyCardType } from '../popupBuyCardType';

type CardTypeData = {
    type: number;
    id: number;
    price: number;
    is_buy: number;
};
export class CardPackShop extends ui.popup.component.cardPackShopUI {
    constructor(data: CardTypeData) {
        super();
        this.init(data);
    }

    protected init(data: CardTypeData) {
        const { pack_base, cost, btn_buy, btn_success } = this;
        const { id, type, price, is_buy } = data;
        const card_pack_ctrl = new CardPackCtrl(pack_base);
        card_pack_ctrl.setType(type);
        if (is_buy) {
            btn_buy.visible = false;
            btn_success.visible = true;
            return;
        }

        cost.text = price;
        btn_buy.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(
                new PopupBuyCardType(data, () => {
                    btn_buy.visible = false;
                    btn_success.visible = true;
                }),
            );
        });
    }
}
