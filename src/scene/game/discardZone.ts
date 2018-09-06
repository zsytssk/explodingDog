import { random } from 'lodash';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { CardModel } from './model/card/card';
import { CardCtrl } from './seat/cardBox/card';
import { CardBaseCtrl } from './seat/cardBox/cardBase';
import { slide_left_in } from '../../mcTree/utils/animate';

export interface Link {
    view: ui.game.discardZoneUI;
    card_box: Laya.Box;
    card_list: CardBaseCtrl[];
}

/** 出牌区域控制器 */
export class DiscardZoneCtrl extends BaseCtrl {
    public name = 'discard_zone';
    protected link = {
        card_list: [],
    } as Link;
    constructor(view: ui.game.discardZoneUI) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
    }
    protected initLink() {
        const { view } = this.link;
        const { card_box } = view;

        this.link = {
            ...this.link,
            card_box,
        };
    }
    public discardCard(card: CardModel | string, card_ctrl?: CardBaseCtrl) {
        const { card_box, card_list } = this.link;
        const { view } = this.link;
        let has_borrow_card = false;
        if (card_ctrl) {
            has_borrow_card = true;
        } else {
            if (card instanceof CardModel) {
                card_ctrl = new CardCtrl(card, card_box);
            } else {
                card_ctrl = new CardBaseCtrl(card, card_box);
            }
        }
        if (card_ctrl.card_id === '3001') {
            card_ctrl.destroy();
            return;
        }
        card_list.push(card_ctrl);
        this.addChild(card_ctrl);
        if (has_borrow_card) {
            this.borrowCard(card_ctrl);
        } else {
            card_ctrl.init();
            card_ctrl.setStyle({
                rotation: random(-2, 2),
                x: view.width / 2,
                y: view.height / 2 - card_list.length,
            });
        }
    }
    public borrowCard(card_ctrl: CardBaseCtrl) {
        if (!(card_ctrl instanceof CardCtrl)) {
            return;
        }
        const { card_box, card_list, view } = this.link;
        let no_time = false;
        if (card_ctrl.card_id === '3101') {
            no_time = true;
        }

        card_ctrl.putCardInWrap(card_box, no_time).then(() => {
            card_ctrl.setStyle({
                rotation: random(-2, 2),
                y: view.height / 2 - card_list.length,
            });
        });
    }
    public async show() {
        const { view } = this.link;
        view.visible = false;
        return slide_left_in(view, 500);
    }
    public hide() {
        const { view } = this.link;
        view.visible = false;
    }
    /** 再来一局时需要reset 清除原有的牌 */
    public reset() {
        const { card_list } = this.link;
        const len = card_list.length;
        for (let i = len - 1; i >= 0; i--) {
            card_list[i].destroy();
            card_list.splice(i, 1);
        }
    }
}
