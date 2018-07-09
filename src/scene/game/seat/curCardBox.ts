import { CurCardCtrl } from './curCard';
import { CardModel } from '../model/card';
import { CardCtrl } from './card';
import { CardBoxCtrl } from './cardBox';

export interface Link {
    view: Laya.Sprite;
}

export class CurCardBoxCtrl extends CardBoxCtrl {
    public children: CardCtrl[];
    protected link = {} as Link;
    constructor(view) {
        super(view);
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected createCardBox(card_box: Laya.Sprite) {
        const card_box_ctrl = new CurCardBoxCtrl(card_box);
        this.addChild(card_box_ctrl);
        card_box_ctrl.init();
        return card_box_ctrl;
    }
    public addCard(card: CardModel) {
        const card_ctrl = new CurCardCtrl(card);
        this.addChild(card_ctrl);
        card_ctrl.init();
        this.sortCard();
    }
}
