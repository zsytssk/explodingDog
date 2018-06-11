import { animate } from '../../utils/animate';
import { CONFIG } from '../../data/config';
import { zutil } from '../../utils/zutil';
import { NodeCtrl } from '../component/node';

interface i_pointerguidetctrl_link {
    pointer_img: Laya.Sprite;
    pointer_ani: Laya.Skeleton;
}

interface SpriteWithTween extends Laya.Sprite {
    tween: Laya.Tween;
}

export type t_pointer_type = 'static' | 'circle' | 'target';

export class PointerGuidetCtrl extends NodeCtrl {
    link: i_pointerguidetctrl_link;
    name = 'pointer';
    /**用来处理点击其他地方 手指移动到目标点的记录点 */
    target_point: t_point;
    constructor() {
        super(new ui.guide.pointerUI());
    }
    init() {
        this.initLink();
    }
    private initLink() {
        let view = this.view;

        let pointer_img = zutil.getElementsByName(view, 'pointer_img')[0];
        let pointer_ani = zutil.getElementsByName(view, 'pointer_ani')[0] as Laya.Skeleton;

        pointer_ani.stop();
        this.link.pointer_img = pointer_img;
        this.link.pointer_ani = pointer_ani;
    }
    /**手指移动指向某个点 */
    public moveToTarget(click_p: t_point, target_p?: t_point) {
        if (target_p) {
            this.target_point = target_p;
        }
        let target_point = this.target_point;
        if (!target_point) {
            return;
        }

        let view = this.view;
        let pointer_img = this.link.pointer_img;

        this.showPointer('static');

        if ((<SpriteWithTween>view).tween) {
            (<SpriteWithTween>view).tween.clear();
        }

        animate.move(view, click_p, target_point, CONFIG.guide_pointer_move_time, () => {
            this.showPointer('target');
        });
    }

    public show(pos: t_point, type?: t_pointer_type, callback?: Function) {
        let parent_dom = this.parent.view;
        let view = this.view;
        let pointer_img = this.link.pointer_img;
        let pointer_ani = this.link.pointer_ani;

        view.visible = false;
        this.showPointer(type);
        view.pos(pos.x, pos.y);

        if (type == "target") {
            this.target_point = {
                x: pos.x,
                y: pos.y
            };
        }

        animate.fade_in(view, CONFIG.guide_pointer_show_time, callback);
    }
    private showPointer(type?: t_pointer_type) {
        type = type ? type : 'static';

        let pointer_img = this.link.pointer_img;
        let pointer_ani = this.link.pointer_ani;

        this.resetView();

        if (type == 'static') {
            pointer_img.visible = true;
        } else {
            pointer_ani.visible = true;
            if (type == 'circle') {
                pointer_ani.play(0, true);
            } else {
                pointer_ani.play(1, true);
            }
        }
    }
    public hidePointer() {
        this.resetView();

        this.target_point = null;
        this.hide();
    }
    private resetView() {

        this.view.alpha = 1;
        let pointer_img = this.link.pointer_img;
        let pointer_ani = this.link.pointer_ani;
        pointer_img.visible = false;
        pointer_ani.visible = false;
        pointer_ani.stop();
    }
    /**隐藏手指 */
    public hide() {
        let view = this.view;
        animate.fade_out(view);
    }
}