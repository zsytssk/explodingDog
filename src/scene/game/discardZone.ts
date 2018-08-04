import { random } from 'lodash';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { CardModel } from './model/card/card';
import { CardCtrl } from './seat/cardBox/card';

export interface Link {
    view: ui.game.discardZoneUI;
    card_box: Laya.Box;
    card_list: CardCtrl[];
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
    public hide() {
        this.link.view.visible = false;
    }
    public discardCard(card_model: CardModel, card_ctrl: CardCtrl) {
        const { card_box, card_list } = this.link;
        const { view } = this.link;
        let has_borrow_card = false;
        if (card_ctrl) {
            has_borrow_card = true;
        } else {
            card_ctrl = new CardCtrl(card_model, card_box);
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
    public borrowCard(card_ctrl: CardCtrl) {
        if (!(card_ctrl instanceof CardCtrl)) {
            return;
        }
        const { card_box, card_list, view } = this.link;
        card_ctrl.putCardInWrap(card_box).then(() => {
            card_ctrl.setStyle({
                rotation: random(-2, 2),
                y: view.height / 2 - card_list.length,
            });
        });
    }
}
