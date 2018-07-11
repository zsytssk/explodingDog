import { CMD } from '../../../../data/cmd';
import { CONFIG } from '../../../../data/config';
import { CardModel, cmd as card_cmd } from '../../model/card';
import { CurCardBoxCtrl } from './curCardBox';
import { CardCtrl, Link as BaseLink } from './card';
import { tween } from '../../../../mcTree/utils/animate';
import { log } from '../../../../mcTree/utils/zutil';
import { getCardInfo } from '../../../../utils/tool';

export interface Link extends BaseLink {
    card_box: CurCardBoxCtrl;
    view: ui.game.seat.cardBox.cardSmallUI;
}

/** 当前用户的牌 */
export class CurCardCtrl extends CardCtrl {
    public parent: CurCardBoxCtrl;
    protected model: CardModel;
    protected link: Link;
    public show_tip = false;
    /** 是否被选中 */
    public is_selected = false;
    /** 是否被触摸 */
    public is_touched = false;
    /** 是否被触摸 */
    public is_move = false;
    private start_pos = {} as Point;
    constructor(model, wrap) {
        super(model, wrap);
    }
    public init() {
        super.init();
        this.initEvent();
    }
    protected initLink() {
        super.initLink();
        this.link.card_box = this.parent;
    }
    public initUI() {
        const { card_id } = this.model;
        const view = new ui.game.seat.cardBox.cardSmallUI();
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
        const { view } = this.link;

        this.onModel(card_cmd.discard, () => {
            this.destroy();
        });

        view.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        view.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        view.on(Laya.Event.MOUSE_UP, this, this.mouseEnd);
        view.on(Laya.Event.MOUSE_OVER, this, this.mouseEnd);
    }
    /** 显示牌的说明 */
    public toggleTip() {
        log('click');
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
        tween({
            end_props,
            sprite,
            start_props,
            time: 100,
        }).then(() => {
            this.handleSelectedEvent();
            card_box.selectCard(this);
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
        this.is_selected = false;

        const { wrap, view, card_box } = this.link;
        const pos = new Laya.Point(view.x, view.y);
        view.stopDrag();
        wrap.globalToLocal(pos);
        wrap.addChild(view);
        if (pos.y < -100) {
            this.serverDiscard();
            return;
        }
        card_box.unSelectCard(this);
    }
    /**  */
    private serverDiscard() {
        this.model.preDiscard();
        Sail.io.emit(CMD.HIT, {
            cardId: this.model.card_id,
            user_id: CONFIG.user_id,
        });
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { view } = this.link;
        const y = 0;
        const x = 100 * index;
        const end_props = { y, x };
        tween({
            end_props,
            sprite: view,
            time: 100,
        });
    }
}
