import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { SeatCtrl } from '../seat/seat';
import { GameCtrl } from '../main';
import { log } from '../../../mcTree/utils/zutil';
import { setStyle, tweenLoop, stopAni } from '../../../mcTree/utils/animate';

export interface Link {
    view: ui.game.widget.slapUI;
    hand_back: Laya.Image;
    hand_face: Laya.Image;
    widget_box: Laya.Sprite;
    ani: Laya.Skeleton;
}

export type SlapType = 'slap_self' | 'slap_other';

/** slap_self属性变化 */
const slap_self_pros_arr = [
    {
        alpha: 0,
        scaleX: 0.5,
        scaleY: 0.5,
    },
    {
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
    },
];

const slap_other_pros_arr = [
    {
        alpha: 0,
        y: 0,
    },
    {
        alpha: 1,
        y: 70,
    },
];
/**  */
export class SlapCtrl extends BaseCtrl {
    public name = 'slap';
    protected link = {} as Link;
    constructor() {
        super();
    }
    public init() {
        this.initLink();
    }
    protected initLink() {
        const view = new ui.game.widget.slapUI();
        const { hand_back, hand_face, ani } = view;
        const game_ctrl = this.parent as GameCtrl;
        const widget_box = game_ctrl.getWidgetBox();

        view.anchorX = 0.5;
        view.anchorY = 0.5;
        this.link = {
            ani,
            hand_back,
            hand_face,
            view,
            widget_box,
        };
    }
    /**
     * 轻拍
     */
    public slap(type: SlapType, seat: SeatCtrl, time: number = 1) {
        if (type === 'slap_other') {
            this.slapOther(seat, time);
        } else {
            this.slapSlef(time);
        }
    }
    private slapSlef(time: number = 1) {
        const { ani, hand_face, view, widget_box } = this.link;

        widget_box.addChild(view);
        view.pos(widget_box.width / 2, widget_box.height / 2);
        ani.visible = true;
        hand_face.visible = true;

        ani.play(0, true);
        let i = 0;
        ani.player.on(Laya.Event.COMPLETE, this, () => {
            i++;
            if (i >= time) {
                this.reset();
            }
            log(i);
        });
        tweenLoop({
            props_arr: slap_self_pros_arr,
            sprite: hand_face,
            time: 200,
        });
    }
    private slapOther(seat: SeatCtrl, time: number = 1) {
        const { ani, hand_back, view, widget_box } = this.link;
        widget_box.addChild(view);
        const seat_bottom_pos = seat.getSeatPos();
        widget_box.globalToLocal(seat_bottom_pos);

        view.pos(seat_bottom_pos.x, seat_bottom_pos.y);
        ani.visible = true;
        hand_back.visible = true;
        setStyle(ani, { scaleX: 0.4, scaleY: 0.4 });
        ani.play(0, true);
        let i = 0;
        ani.player.on(Laya.Event.COMPLETE, this, () => {
            i++;
            if (i >= time) {
                this.reset();
            }
            log(i);
        });
        tweenLoop({
            props_arr: slap_other_pros_arr,
            sprite: hand_back,
            time: 200,
        });
    }
    private reset() {
        const { ani, hand_back, hand_face, view, widget_box } = this.link;
        setStyle(ani, { scaleX: 1, scaleY: 1 });
        ani.stop();
        stopAni(hand_face);
        stopAni(hand_back);
        ani.player.offAll();
        widget_box.removeChild(view);
        hand_face.visible = false;
        hand_back.visible = false;
        ani.visible = false;
    }
}
