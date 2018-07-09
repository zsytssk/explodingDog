import { CurCardCtrl } from './curCard';
import { CardModel } from '../model/card';
import { CardBoxCtrl } from './cardBox';

export type CurCardBoxUI = ui.game.seat.cardBox.curCardBoxUI;
export interface Link {
    view: CurCardBoxUI;
    card_list: CurCardCtrl[];
}

export class CurCardBoxCtrl extends CardBoxCtrl {
    protected link = {} as Link;
    constructor(view: CurCardBoxUI) {
        super(view);
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    public addCard(card: CardModel) {
        const { view } = this.link;
        const card_wrap = view.card_wrap;
        const card_ctrl = new CurCardCtrl(card, card_wrap);
        this.addChild(card_ctrl);
        card_ctrl.init();
        this.sortCard();
    }
}
