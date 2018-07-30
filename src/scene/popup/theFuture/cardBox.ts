import { CardCtrl } from './card';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { setStyle } from '../../../mcTree/utils/animate';

interface Link {
    card_list: CardCtrl[];
    view: Laya.Sprite;
    first_sign: Laya.Sprite;
}
export class CardBoxCtrl extends BaseCtrl {
    public link = {
        card_list: [],
    } as Link;
    public can_sort = false;
    constructor(view: Laya.Sprite, first_sign: Laya.Sprite) {
        super();
        this.link.view = view;
        this.link = {
            ...this.link,
            first_sign,
            view,
        };
    }
    public setCanSort(status: boolean) {
        if (status === this.can_sort) {
            return;
        }
        this.can_sort = status;
    }
    /** 牌的数目变化 重新排列牌发生b */
    public sortCard() {
        const { card_list, first_sign } = this.link;
        /** 排列未选择的牌 */
        const len = card_list.length;
        let first_pos;
        for (let i = 0; i < len; i++) {
            const props = card_list[i].tweenMove(i, len);
            if (i === 0) {
                first_pos = props;
            }
        }
        if (len === 1) {
            first_sign.visible = false;
        } else {
            first_sign.visible = true;
            setStyle(first_sign, {
                rotation: first_pos.rotation,
                x: first_pos.x,
                y: first_sign.y - 10,
            });
        }
    }
    public addCard(card: string) {
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
    public getCardsId() {
        const { card_list } = this.link;
        const list = [] as string[];
        /** 排列未选择的牌 */
        for (const card of card_list) {
            list.push(card.card_id);
        }
        return list;
    }
    /** 牌没有打出去， 回收牌 */
    public calcDrawCardIndex(card, x: number) {
        let { card_list } = this.link;
        if (!this.can_sort) {
            return card_list.findIndex(item => {
                return item === card;
            });
            return;
        }
        card_list = card_list.filter(item => {
            return item !== card;
        });
        let index = 0;
        for (let i = 0; i < card_list.length; i++) {
            if (card_list[i].isOnRight(x)) {
                index = i + 1;
                continue;
            }
        }

        card_list.splice(index, 0, card);
        this.link.card_list = card_list;

        return index;
    }
}
