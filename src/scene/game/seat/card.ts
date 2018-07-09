import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { CardModel } from '../model/card';

type CardView =
    | ui.game.seat.cardBox.otherCardUI
    | ui.game.seat.cardBox.cardSmallUI;
export interface Link {
    view: CardView;
}

/**  */
export class CardCtrl extends BaseCtrl {
    protected link = {} as Link;
    protected model: CardModel;
    protected wrap: Laya.Sprite;
    constructor(model: CardModel, wrap: Laya.Sprite) {
        super();
        this.model = model;
        this.wrap = wrap;
    }
    public initUI() {
        const view = new ui.game.seat.cardBox.otherCardUI();
        this.wrap.addChild(view);
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        this.initUI();
    }
    protected initEvent() {}
    /** 移动位置 */
    public tweenMove(index: number) {
        const { view } = this.link;
        view.x = 20 * index;
    }
}
