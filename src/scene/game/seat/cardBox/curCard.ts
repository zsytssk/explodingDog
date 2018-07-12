import { CMD } from '../../../../data/cmd';
import { CONFIG } from '../../../../data/config';
import { CardModel, cmd as card_cmd } from '../../model/card';
import { CurCardBoxCtrl } from './curCardBox';
import { CardCtrl, Link as BaseLink } from './card';
import { tween } from '../../../../mcTree/utils/animate';
import { log } from '../../../../mcTree/utils/zutil';

export interface Link extends BaseLink {
    card_box: CurCardBoxCtrl;
}

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
    constructor(model, wrap) {
        super(model, wrap);
    }
    protected initEvent() {
        super.initEvent();
        const { view } = this.link;

        this.onModel(card_cmd.un_discard, () => {
            this.withDrawCard();
        });

        view.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        view.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        view.on(Laya.Event.MOUSE_UP, this, this.mouseEnd);
        view.on(Laya.Event.MOUSE_OVER, this, this.mouseEnd);
    }
    /** 显示牌的说明 */
    public toggleTip() {
        const { view: sprite, card_box } = this.link;
        const show_tip = !this.show_tip;

        const y1 = 0;
        const y2 = -250;
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
        if (!this.is_touched) {
            return false;
        }
        if (this.is_selected) {
            return false;
        }
        if (this.show_tip) {
            return false;
        }
        this.is_move = true;
        const { x, y } = this.start_pos;
        const { stageX, stageY } = event;
        const move_delta = {
            x: stageX - x,
            y: stageY - y,
        };
        log(move_delta);
        if (move_delta.y < -30) {
            this.select();
            return;
        }
    }
    private mouseEnd(event: Laya.Event) {
        log('end');
        if (!this.is_touched) {
            return false;
        }
        this.is_touched = false;
        if (!this.is_move) {
            this.toggleTip();
            return;
        }
        this.is_move = false;
    }
    /** 选中某张牌吧 */
    public select() {
        this.is_selected = true;
        this.is_touched = false;
        this.is_move = false;
        const { view: sprite, card_box } = this.link;

        const y1 = 0;
        const y2 = -100;
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
        const { view } = this.link;
        const pos = new Laya.Point(0, 0);
        view.localToGlobal(pos);
        Laya.stage.addChild(view);
        view.pos(pos.x, pos.y);
        view.startDrag();

        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.unSelect);
        Laya.stage.on(Laya.Event.MOUSE_OVER, this, this.unSelect);
    }
    /** 取消选中 */
    private unSelect() {
        if (!this.is_selected) {
            return;
        }
        const { wrap, view } = this.link;
        const pos = new Laya.Point(view.x, view.y);

        this.is_selected = false;
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.unSelect);
        Laya.stage.off(Laya.Event.MOUSE_OVER, this, this.unSelect);
        view.stopDrag();
        wrap.globalToLocal(pos);
        if (pos.y < -100) {
            const can_discard = this.model.preDiscard();
            if (can_discard) {
                Sail.io.emit(CMD.HIT, {
                    hitCard: this.model.card_id,
                    userId: CONFIG.user_id,
                });
                return;
            }
        }
        this.withDrawCard();
    }
    /**  这个方法现在用到 card + cardBox， 这很恶心
     * 而且到后面 牌堆里面的牌也要用这个方法， 这个方法最好放在 cardBox中...
     */
    private withDrawCard() {
        const { wrap, view, card_box } = this.link;
        const card_num = card_box.getCardNum();
        const pos = new Laya.Point(view.x, view.y);
        wrap.globalToLocal(pos);
        view.pos(pos.x, pos.y);
        const space = (view.width * wrap.height) / (view.height * 2);
        let index = Math.ceil(pos.x / space);
        index = card_box.withDrawCardIndex(this, index);
        wrap.addChildAt(view, index);
        card_box.sortCard();
    }
    public putToDisCardZone(wrap: Laya.Sprite) {
        const { view } = this.link;
        view.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        view.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        view.off(Laya.Event.MOUSE_UP, this, this.mouseEnd);
        view.off(Laya.Event.MOUSE_OVER, this, this.mouseEnd);
        return super.putToDisCardZone(wrap);
    }
}
