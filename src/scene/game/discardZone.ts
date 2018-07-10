import { BaseCtrl } from '../../mcTree/ctrl/base';
import { cmd } from '../../mcTree/event';
import { getCardInfo } from '../../utils/tool';
import { CardModel } from './model/card';

export interface Link {
    view: ui.game.discardZoneUI;
    card_box: Laya.Box;
}

/** 出牌区域控制器 */
export class DiscardZoneCtrl extends BaseCtrl {
    protected link = {} as Link;
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
        const { card_box } = this.link;
        const card_ctrl = new DiscardCardCtrl(card, card_box);
        this.addChild(card_ctrl);
        card_ctrl.init();
    }
}

type CardView = ui.game.seat.cardBox.cardBigUI;
export interface CardLink {
    view: CardView;
    wrap: Laya.Sprite;
}
/** 出牌区域牌控制器 */
class DiscardCardCtrl extends BaseCtrl {
    protected link = {} as CardLink;
    protected model: CardModel;
    constructor(model: CardModel, wrap: Laya.Sprite) {
        super(wrap);
        this.model = model;
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        this.initUI();
    }
    public initUI() {
        const { card_id } = this.model;
        const view = new ui.game.seat.cardBox.cardBigUI();
        const { card_id: view_card_id, card_count, card_face } = view;
        const { wrap } = this.link;
        const card_info = getCardInfo(card_id);

        card_face.skin = card_info.url;
        if (card_info.show_count) {
            card_count.visible = true;
            card_count.text = card_info.count;
        }
        view_card_id.text = `id:${card_id}`;
        wrap.addChild(view);
        this.link.view = view;
    }
    protected initEvent() {
        this.onModel(cmd.destroy, () => {
            this.destroy();
        });
    }
}
