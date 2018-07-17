import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel } from '../../model/card/card';
import { CardCtrl } from './card';
import { cmd } from '../../main';

export interface Link {
    view: Laya.Sprite;
    card_list: CardCtrl[];
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
        // ...
    }
    /** 牌的数目变化 重新排列牌发生b */
    public sortCard() {
        const { card_list } = this.link;
        /** 排列未选择的牌 */
        const unslt_card_list = card_list.filter(item => {
            return !item.is_selected;
        });
        for (let i = 0; i < unslt_card_list.length; i++) {
            unslt_card_list[i].tweenMove(i);
        }
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
    public putCardBoxInWrap(wrap: Laya.Sprite) {
        const { view } = this.link;
        const ori_pos = new Laya.Point(0, 0);
        const wrap_pos = new Laya.Point(0, 0);
        view.localToGlobal(ori_pos);
        wrap.globalToLocal(ori_pos);

        view.pos(ori_pos.x, ori_pos.y);
        wrap.addChild(view);
        return this;
    }
}
