import { setStyle, tween } from '../../../mcTree/utils/animate';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { getCardInfo, convertPos } from '../../../utils/tool';
import { CardBoxCtrl } from './cardBox';
import {
    CardBaseCtrl,
    Link as BaseLink,
} from '../../game/seat/cardBox/cardBase';

interface Link extends BaseLink {
    card_box: CardBoxCtrl;
}
export class CardCtrl extends CardBaseCtrl {
    private is_touched = false;
    public link: Link;
    constructor(card_id: string, wrap: Laya.Sprite) {
        super(card_id, wrap);
    }
    public init() {
        super.init();
        this.initEvent();
    }
    protected initLink() {
        super.initLink();
        this.link = {
            ...this.link,
            card_box: this.parent as CardBoxCtrl,
        };
    }
    private initEvent() {
        const { view } = this.link;

        this.onNode(view, Laya.Event.MOUSE_DOWN, this.mouseDown);
    }
    private mouseDown() {
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
        return tween({
            end_props,
            sprite: view,
            time: 50,
        }).then(() => {
            const pos = convertPos(new Laya.Point(0, -50), view, wrap);
            return {
                rotation,
                x: pos.x,
                y: pos.y,
            };
        });
    }
}
