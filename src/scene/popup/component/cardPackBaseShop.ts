import { CMD } from '../../../data/cmd';
import { CardPackCtrl } from './cardPackBase';
import { log } from '../../../mcTree/utils/zutil';
type CardTypeData = {
    type: number;
    card_id: number;
    price: number;
};
export class CardPackShop extends ui.popup.component.cardPackShopUI {
    constructor(data: CardTypeData) {
        super();
        this.init(data);
    }

    protected init(data: CardTypeData) {
        const { pack_base, cost, btn_buy } = this;
        const { card_id, type, price } = data;
        const card_pack_ctrl = new CardPackCtrl(pack_base);
        card_pack_ctrl.setType(type);
        cost.text = '￥' + price;

        btn_buy.on(Laya.Event.CLICK, this, () => {
            log(card_id);
        });
    }
}
