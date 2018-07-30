import { setStyle, tween } from '../../../mcTree/utils/animate';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { getCardInfo } from '../../../utils/tool';
import { CardBoxCtrl } from './cardBox';

interface Link {
    view: ui.game.seat.cardBox.cardUI;
    wrap: Laya.Sprite;
    card_box: CardBoxCtrl;
    card_light: Laya.Skeleton;
}
export class CardCtrl extends BaseCtrl {
    private is_touched = false;
    public card_id: string;
    private scale: number;
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
        const { view } = this.link;
        const { card_light } = view;

        card_light.stop();
        this.link = {
            ...this.link,
            card_box: this.parent as CardBoxCtrl,
            card_light,
        };
    }
    /** 初始化ui， 设置当前其他玩家牌的样式（大小 显示牌背面） */
    private initUI() {
        const { wrap } = this.link;
        const view = new ui.game.seat.cardBox.cardUI();
        const scale = wrap.height / view.height;
        wrap.addChild(view);
        setStyle(view, { scaleX: scale, scaleY: scale });
        this.scale = scale;

        wrap.addChild(view);
        view.anchorX = 0.5;
        view.anchorY = 0.5;
        this.link = {
            ...this.link,
            view,
        };
        this.drawCard();
    }
    /** 绘制牌面 */
    public drawCard() {
        const { card_id } = this;
        const { view } = this.link;
        const card_info = getCardInfo(card_id);
        const { card_id: view_card_id, card_face, card_back } = view;
        if (card_info) {
            card_face.skin = card_info.url;
            view_card_id.text = `id:${card_id}`;
            card_back.visible = false;
        } else {
            card_back.visible = true;
        }
    }
    private initEvent() {
        const { view } = this.link;

        this.onNode(view, Laya.Event.MOUSE_DOWN, this.mouseDown);
    }
    private mouseDown(event: Laya.Event) {
        const { view } = this.link;
        this.is_touched = true;
        const pos = new Laya.Point(view.width / 2, view.height / 2);
        view.localToGlobal(pos);
        Laya.stage.addChild(view);
        view.pos(pos.x, pos.y);
        view.startDrag();

        this.onNode(Laya.stage, Laya.Event.MOUSE_UP, this.unSelect);
        this.onNode(Laya.stage, Laya.Event.MOUSE_OVER, this.unSelect);
    }
    /** 取消选中 */
    private unSelect() {
        if (!this.is_touched) {
            return;
        }
        const { view } = this.link;
        this.is_touched = false;

        this.offNode(Laya.stage);
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
    public tweenMove(index: number, all: number) {
        const { scale } = this;
        const { wrap, view, card_box } = this.link;
        const card_num = card_box.getCardNum();
        const wrap_w = wrap.width;
        let y = 175;

        const rel_hal = index - (all - 1) / 2;
        y += Math.abs(rel_hal) * Math.abs(rel_hal) * 10;
        const rotation = rel_hal * 10;

        const space = (view.width * scale) / 2;
        const x = wrap_w / 2 + space * (index - (card_num - 1) / 2);
        const end_props = { y, x, rotation };
        tween({
            end_props,
            sprite: view,
            time: 100,
        });
        view.zOrder = all - index;
        return {
            rotation,
            x: x - (view.width * scale) / 2,
            y,
        };
    }
}
