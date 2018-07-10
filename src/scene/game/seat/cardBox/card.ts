import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel } from '../../model/card';

type CardView =
    | ui.game.seat.cardBox.otherCardUI
    | ui.game.seat.cardBox.cardSmallUI;
export interface Link {
    view: CardView;
    wrap: Laya.Sprite;
}

/**  */
export class CardCtrl extends BaseCtrl {
    protected link = {} as Link;
    protected model: CardModel;
    constructor(model: CardModel, wrap: Laya.Sprite) {
        super();
        this.model = model;
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
    }
    protected initLink() {
        this.initUI();
    }
    public initUI() {
        const { wrap } = this.link;
        const view = new ui.game.seat.cardBox.otherCardUI();
        wrap.addChild(view);
        this.link.view = view;
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { view } = this.link;
        view.x = 20 * index;
    }
}
