import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel } from '../../model/card/card';
import { CardCtrl } from './card';
import { GameCtrl } from '../../main';
import { queryClosest } from '../../../../mcTree/utils/zutil';

export interface Link {
    view: Laya.Sprite;
    card_list: CardCtrl[];
    card_wrap: Laya.Sprite;
    /** 牌飞行移动时 要放置的节点 */
    card_move_box: Laya.Sprite;
}

export class CardBoxCtrl extends BaseCtrl {
    public name = 'card_box';
    protected link = {
        card_list: [],
    } as Link;
    protected card_creator = CardCtrl;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
    }
    protected initLink() {
        const { view } = this.link;
        const game_ctrl = queryClosest(this, 'name:game') as GameCtrl;
        const card_move_box = game_ctrl.getWidgetBox();

        this.link = {
            ...this.link,
            card_move_box,
            card_wrap: view,
        };
    }
    public getCardMoveBox() {
        return this.link.card_move_box;
    }
    /** 牌的数目变化 重新排列牌发生b */
    public sortCard() {
        const { card_list, card_wrap } = this.link;
        /** 排列未选择的牌 */
        const unslt_card_list = card_list.filter(item => {
            return !item.is_selected;
        });
        const len = unslt_card_list.length;
        if (!len) {
            return;
        }
        let card_bound: {
            width: number;
            space: number;
        };
        for (let i = 0; i < unslt_card_list.length; i++) {
            const card = unslt_card_list[i];
            if (!card_bound) {
                card_bound = card.getCardBound();
            }
            card.tweenMove(i, unslt_card_list.length);
        }
        card_wrap.width = card_bound.width + card_bound.space * (len - 1);
    }
    public removeCard(card: CardCtrl) {
        const { card_list } = this.link;
        this.link.card_list = card_list.filter(item => {
            return item !== card;
        });
        this.removeChild(card);
        this.sortCard();
    }
    /**
     *
     * @param card
     * @param is_insert s
     */
    public addCard(card: CardModel, is_insert?: boolean) {
        const { card_list, card_wrap } = this.link;
        const card_ctrl = new this.card_creator(card, card_wrap, is_insert);
        this.addChild(card_ctrl);
        card_ctrl.init();
        card_list.push(card_ctrl);
        /** 当前用户需要先设置牌到牌堆拿出牌的位置,所以需要异步重组  */
        setTimeout(() => {
            this.sortCard();
        });
        return card_ctrl;
    }
    /**
     * 初始化牌时需要处理多张的牌
     */
    public addCards(cards: CardModel[]) {
        const { card_list, card_wrap } = this.link;
        for (const card of cards) {
            const card_ctrl = new this.card_creator(card, card_wrap);
            this.addChild(card_ctrl);
            card_ctrl.init();
            card_list.push(card_ctrl);
        }
        this.sortCard();
    }
    public clearCards() {
        const { card_list } = this.link;
        for (let len = card_list.length, i = len - 1; i >= 0; i--) {
            card_list.splice(i, 1);
        }
        this.link.card_list = [];
    }
    public getCardNum() {
        return this.link.card_list.length;
    }
    public moveByModel(card_model: CardModel) {
        const { card_list } = this.link;
        for (const card_item of card_list) {
            if (card_item.isCardModel(card_model)) {
                this.removeCard(card_item);
                card_item.resetStyle();
                return card_item;
            }
        }
    }
}
