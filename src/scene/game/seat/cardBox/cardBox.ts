import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel } from '../../model/card';
import { CardCtrl } from './card';
import { cmd } from '../../main';

export interface Link {
    view: Laya.Sprite;
    card_list: CardCtrl[];
}

export class CardBoxCtrl extends BaseCtrl {
    public name = 'card_box';
    protected link = {
        card_list: [],
    } as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        // ...
    }
    /** 牌的数目变化 重新排列牌发生b */
    protected sortCard() {
        const { card_list } = this.link;
        for (let i = 0; i < card_list.length; i++) {
            card_list[i].tweenMove(i);
        }
    }
    /** 出牌 */
    public discardCard(card: CardCtrl) {
        this.removeChild(card);
        this.report(cmd.discard, 'game', { card });
    }
    public addCard(card: CardModel) {
        const { view, card_list } = this.link;
        const card_ctrl = new CardCtrl(card, view);
        this.addChild(card_ctrl);
        card_ctrl.init();
        card_list.push(card_ctrl);
        card_ctrl.setOtherStyle();
        this.sortCard();
    }
}
