import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { CardCtrl } from '../seat/cardBox/card';
import { tween } from '../../../mcTree/utils/animate';
import { CardBaseCtrl } from '../seat/cardBox/cardBase';

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
    protected card: CardCtrl;
    private end_resolve: FuncVoid;
    constructor(view: View) {
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
            card_box,
            view,
        };
    }
    public show(): Promise<string> {
        return new Promise((resolve, reject) => {
            const { view: sprite } = this.link;
            sprite.visible = true;
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
    /** 收到本地操作将命令发给服务器 */
    public preGetCard(card_id: string) {
        if (this.end_resolve) {
            this.end_resolve(card_id);
        }
    }
    /** 服务器收到命令后 cardCtrl会传给自己 */
    public getCard(card: CardCtrl) {
        const { card_box } = this.link;
        this.addChild(card);
        /** 如果当前没有显示, 只需要将card隐藏就可以了 */
        if (!this.end_resolve) {
            this.card = card;
            card.setStyle({ visible: false });
            return;
        }
        card.putCardInWrap(card_box).then(() => {
            this.hide().then(() => {
                card.destroy();
            });
        });
    }
    private hide() {
        const { view: sprite } = this.link;
        const start_props = {
            alpha: 1,
            ...show_pos,
        };
        const end_props = {
            alpha: 0,
            ...hide_pos,
        };
        return tween({
            end_props,
            sprite,
            start_props,
        }).then(() => {
            this.end_resolve = undefined;
            sprite.visible = false;
        });
    }
    /** seat action complete之后， 如果有牌 需要展示牌飞行动画 */
    public reset() {
        this.hide();
    }
    public setCardFace(card: CardBaseCtrl) {
        const face_card = this.card;
        if (!face_card) {
            return;
        }
        const face = face_card.getCardFace();
        card.setFace(face);
        face_card.destroy();
        this.card = undefined;
    }
}
