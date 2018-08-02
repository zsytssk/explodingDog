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
    /** 是否是由cardBox直接借过来， 就不需要自己自取创建了 */
    private is_borrowing = false;
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
        this.link.card_box = card_box;
    }
    public hide() {
        this.link.view.visible = false;
    }
    public discardCard(card: CardModel) {
        if (this.is_borrowing) {
            return;
        }
        const { card_box, card_list } = this.link;
        const { view } = this.link;
        const card_ctrl = new CardCtrl(card, card_box);
        card_list.push(card_ctrl);

        this.addChild(card_ctrl);

        card_ctrl.init();
        card_ctrl.setStyle({
            rotation: random(-2, 2),
            x: view.width / 2,
            y: view.height / 2 - card_list.length,
        });
    }
    public borrowCard(card_ctrl: CardCtrl) {
        if (!(card_ctrl instanceof CardCtrl)) {
            return;
        }
        this.is_borrowing = true;
        const { card_box, card_list, view } = this.link;
        this.addChild(card_ctrl);
        card_list.push(card_ctrl);
        card_ctrl.putCardInWrap(card_box).then(() => {
            card_ctrl.setStyle({
                rotation: random(-2, 2),
                y: view.height / 2 - card_list.length,
            });
        });
    }
    public reset() {
        this.is_borrowing = false;
    }
}
