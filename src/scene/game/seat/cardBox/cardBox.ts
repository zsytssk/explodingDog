import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel } from '../../model/card';
import { CardCtrl } from './card';

export interface Link {
    view: Laya.Sprite;
    card_list: CardCtrl[];
}

export abstract class CardBoxCtrl extends BaseCtrl {
    protected link = {
        card_list: [],
    } as Link;
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
    public abstract addCard(card: CardModel): void;
    /** 牌的数目变化 重新排列牌发生b */
    protected sortCard() {
        const { card_list } = this.link;
        for (let i = 0; i < card_list.length; i++) {
            card_list[i].tweenMove(i);
        }
    }
}
