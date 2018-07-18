import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel } from '../../model/card/card';
import { CardCtrl } from './card';
import { cmd } from '../../main';

export interface Link {
    view: Laya.Sprite;
    card_list: CardCtrl[];
    card_wrap: Laya.Sprite;
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
        this.initLink();
    }
    protected initLink() {
        const { view } = this.link;
        this.link = {
            ...this.link,
            card_wrap: view,
        };
    }
    /** 牌的数目变化 重新排列牌发生b */
    public sortCard() {
        const { card_list, card_wrap } = this.link;
        /** 排列未选择的牌 */
        const unslt_card_list = card_list.filter(item => {
            return !item.is_selected;
        });
        const len = unslt_card_list.length;
        let card_bound: {
            width: number;
            space: number;
        };
        for (let i = 0; i < unslt_card_list.length; i++) {
            const card = unslt_card_list[i];
            if (!card_bound) {
                card_bound = card.getCardBound();
            }
            card.tweenMove(i);
        }
        card_wrap.width = card_bound.width + card_bound.space * (len - 1);
    }
    /** 出牌 将牌从列表中清除 */
    public discardCard(card: CardCtrl) {
        const { card_list } = this.link;
        this.link.card_list = card_list.filter(item => {
            return item !== card;
        });
        this.removeChild(card);
        this.report(cmd.discard, 'game', { card });
        this.sortCard();
    }
    public addCard(card: CardModel) {
        const { view, card_list } = this.link;
        const card_ctrl = new CardCtrl(card, view);
        this.addChild(card_ctrl);
        card_ctrl.init();
        card_list.push(card_ctrl);
        this.sortCard();
    }
    public getCardNum() {
        return this.link.card_list.length;
    }
}
