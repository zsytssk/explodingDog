import { setStyle, tween } from '../../../../mcTree/utils/animate';
import { log } from '../../../../mcTree/utils/zutil';
import { convertPos, playSkeleton, stopSkeleton } from '../../../../utils/tool';
import { CardModel, cmd as card_cmd } from '../../model/card/card';
import { CardCtrl, Link as BaseLink, space_scale } from './card';
import { CurCardBoxCtrl } from './curCardBox';

export interface Link extends BaseLink {
    card_box: CurCardBoxCtrl;
}

type FaceProps = {
    scale: number;
    pos: Laya.Point;
};

/** 当前用户的牌 */
export class CurCardCtrl extends CardCtrl {
    public parent: CurCardBoxCtrl;
    protected model: CardModel;
    protected link: Link;
    public show_tip = false;
    /** 是否被触摸 */
    public is_touched = false;
    /** 是否被触摸 */
    public is_move = false;
    private start_pos = {} as Point;
    constructor(model: CardModel, wrap: Laya.Sprite, is_insert?: boolean) {
        super(model, wrap, is_insert);
    }
    protected initEvent() {
        super.initEvent();
        const { view } = this.link;

        this.onModel(card_cmd.un_draw, () => {
            this.unDraw();
        });

        this.onNode(view, Laya.Event.MOUSE_DOWN, this.mouseDown);
        this.onNode(view, Laya.Event.MOUSE_MOVE, this.mouseMove);
        this.onNode(view, Laya.Event.MOUSE_UP, this.mouseEnd);
        this.onNode(view, Laya.Event.MOUSE_OVER, this.mouseEnd);
    }
    /** 牌可以被选中 */
    private canSelect() {
        if (!this.is_touched) {
            return false;
        }
        if (this.is_selected) {
            return false;
        }
        if (this.show_tip) {
            return false;
        }
        const { card_box } = this.link;
        if (card_box.isMove()) {
            return false;
        }
        return true;
    }
    /** 显示牌的说明 */
    public toggleTip() {
        const { view: sprite, card_box } = this.link;
        const { scale } = this;
        const show_tip = !this.show_tip;

        const center_y = (sprite.height * scale) / 2;
        const y1 = center_y;
        const y2 = -250 + center_y;
        let start_props;
        let end_props;
        if (show_tip) {
            start_props = { y: y1 };
            end_props = { y: y2 };
            card_box.unToggleExcept(this);
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
        this.show_tip = show_tip;
    }

    private mouseDown(event: Laya.Event) {
        this.is_touched = true;
        this.start_pos = {
            x: event.stageX,
            y: event.stageY,
        };
    }
    private mouseMove(event: Laya.Event) {
        if (!this.canSelect()) {
            return false;
        }
        const { x, y } = this.start_pos;
        const { stageX, stageY } = event;
        const move_delta = {
            x: stageX - x,
            y: stageY - y,
        };
        this.is_move = true;
        if (
            move_delta.y < -30 &&
            Math.abs(move_delta.x) < Math.abs(move_delta.y)
        ) {
            this.select();
            return;
        }
    }
    private mouseEnd() {
        if (!this.is_touched) {
            return false;
        }
        this.is_touched = false;
        this.start_pos = {} as Point;
        if (!this.is_move) {
            this.toggleTip();
            return;
        }
        this.is_move = false;
        log('card:>end');
    }
    /** 选中某张牌吧 */
    public select() {
        const { scale } = this;
        const { view: sprite, card_box } = this.link;
        this.is_selected = true;
        this.is_touched = false;
        this.is_move = false;

        const center_y = (sprite.height * scale) / 2;
        const y1 = 0 + center_y;
        const y2 = -100 + center_y;
        const start_props = { y: y1 };
        const end_props = { y: y2 };

        card_box.sortCard();
        tween({
            end_props,
            sprite,
            start_props,
            time: 100,
        }).then(() => {
            this.handleSelectedEvent();
        });
    }
    /** 处理选中之后的事件 */
    private handleSelectedEvent() {
        const { scale } = this;
        const { view, card_box } = this.link;
        const card_move_box = card_box.getCardMoveBox();

        const pos = new Laya.Point(
            (view.width * scale) / 2,
            (view.height * scale) / 2,
        );
        convertPos(pos, view, card_move_box);
        card_move_box.addChild(view);
        view.pos(pos.x, pos.y);
        view.startDrag();
        card_box.has_card_drag = true;

        this.onNode(Laya.stage, Laya.Event.MOUSE_UP, this.unSelect);
        this.onNode(Laya.stage, Laya.Event.MOUSE_OVER, this.unSelect);
    }
    /** 取消选中 */
    private unSelect() {
        if (!this.is_selected) {
            return;
        }
        const { wrap, view, card_box } = this.link;
        const pos = new Laya.Point(view.x, view.y);
        card_box.has_card_drag = false;

        this.offNode(Laya.stage);
        view.stopDrag();
        wrap.globalToLocal(pos);
        if (pos.y < -100) {
            this.calcDiscard();
            return;
        }
        this.unDraw();
    }
    /** 计算各种出牌的类型 出牌命令在seat中发出
     * cardCtrl --. cardModel -- player -- seat --> hit | give_card
     */
    private calcDiscard() {
        const pre_drawed = this.model.preDrawCard();
        /** 不是出牌状态 直接退回牌堆 */
        if (!pre_drawed) {
            this.unDraw();
        }
    }
    /** @ques 这个方法现在用到 card + cardBox， 这很恶心
     * 而且到后面 牌堆里面的牌也要用这个方法， 这个方法最好放在 cardBox中...
     */
    private unDraw() {
        this.is_selected = false;
        const { wrap, view, card_box } = this.link;
        const pos = new Laya.Point(view.x, view.y);
        wrap.globalToLocal(pos);
        view.pos(pos.x, pos.y);
        this.putInBoxByPos(pos);
        card_box.sortCard();
    }
    public putCardInWrap(wrap: Laya.Sprite, no_time?: boolean) {
        this.is_selected = false;
        const { view } = this.link;
        this.offNode(view);
        return super.putCardInWrap(wrap, no_time);
    }
    /** 通过CardHeap中牌的位置大小 设置牌的属性 计算放的位置 再放到牌堆 */
    public setFace(props: FaceProps) {
        const { view, wrap, card_light } = this.link;
        const { scale, pos } = props;
        wrap.globalToLocal(pos);
        card_light.visible = true;
        playSkeleton(card_light, 0, true);
        this.is_copy_face = true;
        setStyle(view, {
            scaleX: scale,
            scaleY: scale,
            x: pos.x,
            y: pos.y,
        });
        this.putInBoxByPos(pos);
        // this.withDrawCard();
    }
    /** 通过牌的x位置设置 */
    private putInBoxByPos(pos: Laya.Point) {
        const { scale } = this;
        const { wrap, view, card_box } = this.link;
        const space = view.width * scale * space_scale;
        const center_x = (view.width * scale) / 2;
        let index = Math.ceil((pos.x - center_x) / space);
        index = card_box.withDrawCardIndex(this, index);
        wrap.addChildAt(view, index);
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { view, card_light } = this.link;
        const { scale, is_copy_face } = this;
        const space = view.width * scale * space_scale;
        let time = 200;
        const x = (view.width * scale) / 2 + space * index;
        let y = (view.height * scale) / 2;

        if (index % 2 === 1) {
            y = y + 15;
        }

        let end_props = { y, x } as AnyObj;

        if (this.is_insert) {
            if (!is_copy_face) {
                view.x = x;
            } else {
                time = 700;
            }
            end_props = {
                ...end_props,
                scaleX: scale,
                scaleY: scale,
            };
            this.is_copy_face = false;
            view.visible = true;
            this.is_insert = false;
        }
        view.zOrder = index;
        tween({
            end_props,
            sprite: view,
            time,
        }).then(() => {
            stopSkeleton(card_light);
            card_light.visible = false;
        });
    }
}
