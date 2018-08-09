import { CMD } from '../../../data/cmd';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { tween } from '../../../mcTree/utils/animate';
import { queryClosest } from '../../../mcTree/utils/zutil';
import { convertPos, playSkeleton, stopSkeleton, getSoundPath } from '../../../utils/tool';
import { GameCtrl } from '../main';
import { CurCardCtrl } from '../seat/cardBox/curCard';
import { CardHeapCtrl } from './main';

type Status = 'disabled' | 'actived';
type CardUI = ui.game.seat.cardBox.cardUI;
interface Link {
    view: CardUI;
    wrap: Laya.Sprite;
    card_move_box: Laya.Sprite;
    card_light: Laya.Skeleton;
    card_box: CardHeapCtrl;
}
export class CardCtrl extends BaseCtrl {
    public name = 'card';
    private is_touched = false;
    public scale: number;
    public link = {} as Link;
    public status: Status;
    private is_move = false;
    constructor(view: CardUI, wrap: Laya.Sprite) {
        super();

        this.link = {
            view,
            wrap,
        } as Link;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    public hide() {
        const { view } = this.link;
        view.visible = false;
    }
    public show() {
        const { view } = this.link;
        view.visible = true;
    }
    protected initLink() {
        const { view, wrap } = this.link;
        const { card_light } = view;
        const game_ctrl = queryClosest(this, 'name:game') as GameCtrl;
        const card_move_box = game_ctrl.getWidgetBox();

        card_light.visible = false;
        stopSkeleton(card_light);
        this.link = {
            ...this.link,
            card_box: this.parent as CardHeapCtrl,
            card_light,
            card_move_box,
        };
        const scale = wrap.width / view.width;
        this.scale = scale;
    }
    private initEvent() {
        const { view } = this.link;

        this.onNode(view, Laya.Event.MOUSE_DOWN, this.mouseDown);
    }
    private mouseDown(event: Laya.Event) {
        const { status, is_move } = this;
        if (status === 'disabled' || is_move) {
            return;
        }
        const { view, card_move_box } = this.link;
        this.is_touched = true;
        const { x, y } = {
            x: view.width / 2,
            y: view.height / 2,
        };

        const pos = new Laya.Point(x, y);
        convertPos(pos, view, card_move_box);
        card_move_box.addChild(view);
        view.pos(pos.x, pos.y);
        view.startDrag();
        Laya.SoundManager.playSound(getSoundPath('draw_down'), 0);
        this.is_move = true;

        this.onNode(Laya.stage, Laya.Event.MOUSE_UP, this.unSelect);
        this.onNode(Laya.stage, Laya.Event.MOUSE_OVER, this.unSelect);
    }
    /** 取消选中 */
    private unSelect() {
        if (!this.is_touched) {
            return;
        }
        const { wrap, view, card_move_box } = this.link;
        const { scale } = this;
        const pos = new Laya.Point(
            view.x - (view.width * scale) / 2,
            view.y - (view.height * scale) / 2,
        );
        convertPos(pos, card_move_box, wrap);

        const { y } = pos;
        this.is_touched = false;
        this.offNode(Laya.stage);
        view.stopDrag();
        Laya.SoundManager.stopSound(getSoundPath('draw_down'));
        if (y > 120) {
            Sail.io.emit(CMD.TAKE);
            return;
        }

        this.withDrawCard();
    }
    /**  这个方法现在用到 card + cardBox， 这很恶心
     * 而且到后面 牌堆里面的牌也要用这个方法， 这个方法最好放在 cardBox中...
     */
    public withDrawCard() {
        const { scale } = this;
        const { wrap, view, card_move_box } = this.link;
        const pos = new Laya.Point(view.x, view.y);
        convertPos(pos, card_move_box, wrap);
        const { x, y } = {
            x: (view.width * scale) / 2,
            y: (view.height * scale) / 2,
        };
        const end_pos = new Laya.Point(x, y);
        convertPos(end_pos, wrap, card_move_box);

        tween({
            end_props: end_pos,
            sprite: view,
        }).then(() => {
            wrap.addChild(view);
            this.is_move = false;
            view.pos(x, y);
        });
    }
    public setStatus(status: Status) {
        const { card_light } = this.link;
        if (this.status === status) {
            return;
        }
        if (status === 'actived') {
            /** 直接播放会报错 */
            card_light.visible = true;
            playSkeleton(card_light, 0, true);
        } else {
            card_light.visible = false;
            stopSkeleton(card_light);
        }
        this.status = status;
    }
    public withDrawCardNoTime() {
        const { scale } = this;
        const { wrap, view } = this.link;
        const { x, y } = {
            x: (view.width * scale) / 2,
            y: (view.height * scale) / 2,
        };

        wrap.addChild(view);
        view.pos(x, y);
        this.is_move = false;
    }
    public reset() {
        this.withDrawCardNoTime();
        this.setStatus('disabled');
    }
    /** 设置当前用户牌的样式 */
    public putFaceToCard(card: CurCardCtrl) {
        const { scale } = this;
        const { wrap, view, card_move_box } = this.link;
        const pos = new Laya.Point(view.x, view.y);
        if (view.parent === card_move_box) {
            card_move_box.localToGlobal(pos);
        } else {
            wrap.localToGlobal(pos);
        }
        card.setFace({
            pos,
            scale,
        });
        this.withDrawCardNoTime();
    }
}
