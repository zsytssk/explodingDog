import { setStyle, tween } from '../../../mcTree/utils/animate';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { getCardInfo } from '../../../utils/tool';
import { CardBoxCtrl } from './cardBox';

interface Link {
    view: ui.game.seat.cardBox.cardUI;
    wrap: Laya.Sprite;
    card_box: CardBoxCtrl;
}
export class CardCtrl extends BaseCtrl {
    private is_touched = false;
    public card_id: string;
    private scale: number;
    private space: number;
    public link = {} as Link;
    constructor(card_id, wrap: Laya.Sprite) {
        super();
        this.card_id = card_id;
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        this.initUI();
    }
    /** 初始化ui， 设置当前其他玩家牌的样式（大小 显示牌背面） */
    private initUI() {
        const { wrap } = this.link;
        const view = new ui.game.seat.cardBox.cardUI();
        const scale = wrap.height / view.height;
        const space = (view.width * scale) / 2;
        const card_box = this.parent;
        wrap.addChild(view);
        setStyle(view, { scaleX: scale, scaleY: scale });
        this.scale = scale;
        this.space = space;

        wrap.addChild(view);
        view.anchorX = 0.5;
        view.anchorY = 0.5;
        this.link = {
            card_box: this.parent,
            view,
            ...this.link,
        };
        this.setStyle();
    }
    /** 设置牌的样式 */
    public setStyle() {
        const { card_id } = this;
        const { view } = this.link;
        const card_info = getCardInfo(card_id);
        const {
            card_id: view_card_id,
            card_count,
            card_face,
            card_back,
        } = view;
        if (card_info) {
            card_face.skin = card_info.url;
            if (card_info.show_count) {
                card_count.visible = true;
                card_count.text = card_info.count;
            }
            view_card_id.text = `id:${card_id}`;
            card_back.visible = false;
        } else {
            card_back.visible = true;
        }
    }
    private initEvent() {
        const { card_box } = this.link;
        if (!card_box.can_sort) {
            return;
        }
        const { view } = this.link;
        view.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
    }
    private mouseDown(event: Laya.Event) {
        const { view } = this.link;
        this.is_touched = true;
        const pos = new Laya.Point(view.width / 2, view.height / 2);
        view.localToGlobal(pos);
        Laya.stage.addChild(view);
        view.pos(pos.x, pos.y);
        view.startDrag();

        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.unSelect);
        Laya.stage.on(Laya.Event.MOUSE_OVER, this, this.unSelect);
    }
    /** 取消选中 */
    private unSelect() {
        if (!this.is_touched) {
            return;
        }
        const { view } = this.link;
        this.is_touched = false;
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.unSelect);
        Laya.stage.off(Laya.Event.MOUSE_OVER, this, this.unSelect);
        view.stopDrag();
        this.withDrawCard();
    }
    /**  这个方法现在用到 card + cardBox， 这很恶心
     * 而且到后面 牌堆里面的牌也要用这个方法， 这个方法最好放在 cardBox中...
     */
    private withDrawCard() {
        const { wrap, view, card_box } = this.link;
        const pos = new Laya.Point(view.x, view.y);

        wrap.globalToLocal(pos);
        view.pos(pos.x, pos.y);
        const index = card_box.calcDrawCardIndex(this, pos.x);
        wrap.addChildAt(view, index);
        card_box.sortCard();
    }
    /** 判断x是否在本身的右边 */
    public isOnRight(x: number) {
        const { view } = this.link;
        return view.x < x;
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { space } = this;
        const { wrap, view, card_box } = this.link;
        const card_num = card_box.getCardNum();
        const wrap_w = wrap.width;
        const y = 175;
        const x = wrap_w / 2 + space * (index - (card_num - 1) / 2);
        const end_props = { y, x };
        tween({
            end_props,
            sprite: view,
            time: 100,
        });
    }
}
