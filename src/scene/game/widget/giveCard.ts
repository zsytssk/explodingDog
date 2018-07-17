import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { CardCtrl } from '../seat/cardBox/card';
import { tween } from '../../../mcTree/utils/animate';

type View = ui.game.widget.giveCardUI;
export interface Link {
    view: View;
    card_box: Laya.Box;
}

/** 显示的位置 */
const show_pos = {
    x: 750,
    y: 283,
};
/** 隐藏的位置的位置 */
const hide_pos = {
    x: 1033,
    y: -261,
};
/** 给与对方一张牌 */
export class GiveCardCtrl extends BaseCtrl {
    public name = 'give_card';
    protected link = {} as Link;
    private end_resolve: FuncVoid;
    private card: CardCtrl;
    constructor(view: View) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const { view } = this.link;
        const { card_box } = view;

        this.link = {
            card_box,
            view,
        };
    }
    protected initEvent() {}
    public show(): Promise<string> {
        return new Promise((resolve, reject) => {
            const { view: sprite } = this.link;
            const start_props = {
                alpha: 0,
                ...hide_pos,
            };
            const end_props = {
                alpha: 1,
                ...show_pos,
            };
            tween({
                end_props,
                sprite,
                start_props,
            });
            this.end_resolve = resolve;
        });
    }
    public getCard(card: CardCtrl) {
        const { card_box } = this.link;
        this.addChild(card);
        this.card = card;
        card.putCardInWrap(card_box).then(() => {
            if (this.end_resolve) {
                this.end_resolve(card.getCardId());
            }
        });
    }
    public hide() {
        const { view: sprite } = this.link;
        const { card } = this;
        const start_props = {
            alpha: 1,
            ...show_pos,
        };
        const end_props = {
            alpha: 0,
            ...hide_pos,
        };
        tween({
            end_props,
            sprite,
            start_props,
        }).then(() => {
            if (card) {
                card.destroy();
                this.card = undefined;
            }
        });

        this.end_resolve = undefined;
    }
}
