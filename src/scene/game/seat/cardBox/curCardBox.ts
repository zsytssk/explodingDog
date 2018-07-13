import { CurCardCtrl } from './curCard';
import { CardModel } from '../../model/card/card';
import { CardBoxCtrl } from './cardBox';
import { CardCtrl } from './card';

export type CurCardBoxUI = ui.game.seat.cardBox.curCardBoxUI;
export interface Link {
    view: CurCardBoxUI;
    card_list: CurCardCtrl[];
}

export class CurCardBoxCtrl extends CardBoxCtrl {
    protected link: Link;
    constructor(view: CurCardBoxUI) {
        super(view);
        this.link.view = view;
    }
    public addCard(card: CardModel) {
        const { view, card_list } = this.link;
        const card_wrap = view.card_wrap;
        const card_ctrl = new CurCardCtrl(card, card_wrap);
        this.addChild(card_ctrl);
        card_ctrl.init();
        card_list.push(card_ctrl);
        this.sortCard();
    }
    /** 牌没有打出去， 回收牌 */
    public withDrawCardIndex(card, index: number) {
        let { card_list } = this.link;
        if (index > card_list.length - 1) {
            index = card_list.length - 1;
        }
        card_list = card_list.filter(item => {
            return item !== card;
        });

        card_list.splice(index, 0, card);
        this.link.card_list = card_list;

        return index;
    }
    public unToggleExcept(card: CardCtrl) {
        const { card_list } = this.link;
        for (const card_item of card_list) {
            if (card_item === card) {
                continue;
            }
            if (card_item.show_tip) {
                card_item.toggleTip();
            }
        }
    }
}
