import { CardBoxCtrl } from './cardBox';
import { CardModel } from '../model/card';
import { CardCtrl } from './card';
export interface Link {
    view: Laya.Sprite;
}
/**  */
export class OtherCardBoxCtrl extends CardBoxCtrl {
    protected link = {} as Link;
    constructor(view) {
        super(view);
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {}
    protected initEvent() {}
    public addCard(card: CardModel) {
        const card_ctrl = new CardCtrl(card);
        this.addChild(card_ctrl);
        card_ctrl.init();
        this.sortCard();
    }
}
