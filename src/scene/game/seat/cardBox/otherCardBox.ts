import { CardBoxCtrl, Link as BaseLink } from './cardBox';
import { CardModel } from '../../model/card';
import { CardCtrl } from './card';
export interface Link extends BaseLink {
    view: Laya.Sprite;
}
/**  */
export class OtherCardBoxCtrl extends CardBoxCtrl {
    constructor(view: Laya.Sprite) {
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
        const { view, card_list } = this.link;
        const card_ctrl = new CardCtrl(card, view);
        this.addChild(card_ctrl);
        card_ctrl.init();
        card_list.push(card_ctrl);
        this.sortCard();
    }
}
