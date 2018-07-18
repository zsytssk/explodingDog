import { CurCardCtrl } from './curCard';
import { CardModel } from '../../model/card/card';
import { CardBoxCtrl } from './cardBox';
import { CardCtrl } from './card';
import { CurSeatCtrl } from '../curSeat';

export type CurCardBoxUI = ui.game.seat.cardBox.curCardBoxUI;
export interface Link {
    view: CurCardBoxUI;
    seat: CurSeatCtrl;
    card_list: CurCardCtrl[];
}

export class CurCardBoxCtrl extends CardBoxCtrl {
    protected link: Link;
    constructor(view: CurCardBoxUI) {
        super(view);
        this.link.view = view;
    }
    public init() {
        this.initLink();
    }
    protected initLink() {
        this.link.seat = this.parent as CurSeatCtrl;
    }
    public addCard(card: CardModel) {
        const { view, card_list } = this.link;
        const card_wrap = view.card_wrap;
        const card_ctrl = new CurCardCtrl(card, card_wrap);
        this.addChild(card_ctrl);
        card_ctrl.init();
        card_list.push(card_ctrl);
        this.sortCard();
    }
    /** 牌没有打出去， 回收牌 */
    public withDrawCardIndex(card, index: number) {
        let { card_list } = this.link;
        if (index > card_list.length - 1) {
            index = card_list.length - 1;
        }
        card_list = card_list.filter(item => {
            return item !== card;
        });

        card_list.splice(index, 0, card);
        this.link.card_list = card_list;

        return index;
    }
    /** 给牌给别人 */
    public giveCard(card: CardCtrl) {
        const { seat, card_list } = this.link;
        this.link.card_list = card_list.filter(item => {
            return item !== card;
        });
        this.removeChild(card);
        this.sortCard();
        seat.giveCard(card);
    }
    public unToggleExcept(card: CardCtrl) {
        const { card_list } = this.link;
        for (const card_item of card_list) {
            if (card_item === card) {
                continue;
            }
            if (card_item.show_tip) {
                card_item.toggleTip();
            }
        }
    }
    /** 将本身放到另外的上面去， 炸弹弹出层里面 */
    public putCardBoxInWrap(wrap: Laya.Sprite) {
        const { view } = this.link;
        const ori_pos = new Laya.Point(0, 0);
        view.localToGlobal(ori_pos);
        wrap.globalToLocal(ori_pos);

        view.pos(ori_pos.x, ori_pos.y);
        wrap.addChild(view);
        return this;
    }
}
