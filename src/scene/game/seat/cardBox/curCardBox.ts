import { CurCardCtrl } from './curCard';
import { CardModel } from '../../model/card';
import { CardBoxCtrl } from './cardBox';
import { CardCtrl } from './card';

export type CurCardBoxUI = ui.game.seat.cardBox.curCardBoxUI;
export interface Link {
    view: CurCardBoxUI;
    card_list: CurCardCtrl[];
}

export class CurCardBoxCtrl extends CardBoxCtrl {
    protected link: Link;
    private selected_card: CurCardCtrl;
    constructor(view: CurCardBoxUI) {
        super(view);
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
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
    /** 选中某张牌， 将其他的牌 */
    public selectCard(card: CurCardCtrl) {
        const { card_list } = this.link;
        this.link.card_list = card_list.filter(item => {
            return item !== card;
        });

        this.selected_card = card;

        this.sortCard();
    }
    /** */
    public unSelectCard(card: CurCardCtrl) {
        const { card_list } = this.link;
        card_list.push(card);
        this.selected_card = undefined;
        this.sortCard();
    }
}
