import { CardModel } from '../model/card';
import { CurCardBoxCtrl } from './curCardBox';
import { CardCtrl, Link as BaseLink } from './card';
import { tween } from '../../../mcTree/utils/animate';
import { getCardInfo } from '../../../utils/tool';

export interface Link extends BaseLink {
    view: ui.game.seat.cardBox.cardSmallUI;
}

/** 当前用户的牌 */
export class CurCardCtrl extends CardCtrl {
    public parent: CurCardBoxCtrl;
    protected model: CardModel;
    protected link = {} as Link;
    private is_toggled = false;
    constructor(model, wrap) {
        super(model, wrap);
    }
    public initUI() {
        const { card_id } = this.model;
        const card_info = getCardInfo(card_id);

        const view = new ui.game.seat.cardBox.cardSmallUI();
        const { card_id: view_card_id, card_count, card_face } = view;
        card_face.skin = card_info.url;
        if (card_info.show_count) {
            card_count.visible = true;
            card_count.text = card_info.count;
        }
        view_card_id.text = `id:${card_id}`;
        this.wrap.addChild(view);
        this.link.view = view;
    }
    protected initEvent() {
        const { view } = this.link;

        view.on(Laya.Event.CLICK, this, this.toggle);
    }
    private toggle() {
        const { view: sprite } = this.link;
        const y1 = 0;
        const y2 = -250;
        let start_props;
        let end_props;
        if (!this.is_toggled) {
            start_props = { y: y1 };
            end_props = { y: y2 };
        } else {
            start_props = { y: y2 };
            end_props = { y: y1 };
        }
        tween({
            end_props,
            sprite,
            start_props,
            time: 300,
        });
        this.is_toggled = !this.is_toggled;
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { view } = this.link;
        view.x = 100 * index;
    }
}
