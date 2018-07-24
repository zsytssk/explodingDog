import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel } from '../../model/card/card';
import { CardCtrl } from './card';
import { cmd, GameCtrl } from '../../main';
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
        this.sortCard();
        this.report(cmd.discard, 'game', { card });
    }
    public giveCard(card: CardCtrl) {
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
        const { view, card_list } = this.link;
        const card_ctrl = new CardCtrl(card, view, is_insert);
        this.addChild(card_ctrl);
        card_ctrl.init();
        card_list.push(card_ctrl);
        this.sortCard();
    }
    /**
     * 初始化牌时需要处理多张的牌
     */
    public addCards(cards: CardModel[]) {
        const { view, card_list } = this.link;
        for (const card of cards) {
            const card_ctrl = new CardCtrl(card, view);
            this.addChild(card_ctrl);
            card_ctrl.init();
            card_list.push(card_ctrl);
        }
        this.sortCard();
    }
    public getCardNum() {
        return this.link.card_list.length;
    }
}
