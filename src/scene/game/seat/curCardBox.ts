import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { CurCardCtrl } from './curCard';
import { CardModel } from '../model/card';
import { CardCtrl } from './card';

export interface Link {
    view: Laya.Sprite;
}

/**  */
export class CurCardBoxCtrl extends BaseCtrl {
    public children: CardCtrl[];
    protected link = {} as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {}
    protected initEvent() {}
    public addCard(card: CardModel) {
        const card_ctrl = new CurCardCtrl(card);
        this.addChild(card_ctrl);
        card_ctrl.init();
        this.sortCard();
    }
    /** 牌的数目变化 重新排列牌发生b */
    private sortCard() {
        const card_list = this.children;
        for (let i = 0; i < card_list.length; i++) {
            card_list[i].tweenMove(i);
        }
    }
}
