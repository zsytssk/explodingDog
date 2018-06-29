import { CMD } from '../../data/cmd';
import { CardPack } from './component/cardPack';

const position2 = [190, 730];//两个牌组时的定位
const position3 = [20, 460, 900];//三个牌组时的定位

export class PopupCards extends ui.popup.popupCardsUI {
    constructor() {
        super();
        this.init();
    }
    init() {
        Sail.io.register(CMD.CARD_TYPE_LIST, this, this.initCardPack);
        Sail.io.emit(CMD.CARD_TYPE_LIST);
    }

    setType(type) { }

    initCardPack(data) {
        let list = data.list;
        if (Array.isArray(list)) {
            list.forEach((item, index) => {
                let cardPack = new CardPack(item);
                if (list.length == 2) {
                    cardPack.left = position2[index];
                } else if (list.length == 3) {
                    cardPack.left = position3[index];
                }
                this.cardBox.addChild(cardPack);
            });
        }
    }
}
