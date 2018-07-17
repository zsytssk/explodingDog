
// import { CurCardBoxCtrl } from "../seat/cardBox/curCardBox";
import { CardModel } from "../model/card/card";

export class PopupDefuse extends ui.popup.popupDefuseUI {
    cardBoxCtrl;
    constructor() {
        super();
    }
    setCards(cards: CardModel[], card_box_ctrl) {
        const { card_box_wrap } = this;
        this.cardBoxCtrl = card_box_ctrl;
        card_box_ctrl.putCardBoxInWrap(card_box_wrap);
    }
}