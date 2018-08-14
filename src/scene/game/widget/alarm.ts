import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { tween, countDown, stopAni } from '../../../mcTree/utils/animate';
import { getSoundPath } from '../../../utils/tool';

type View = ui.game.widget.alarmUI;
export interface Link {
    view: View;
    arrow: Laya.Sprite;
    count: Laya.Label;
}

/** 显示的位置 */
const show_pos = {
    x: 1146,
    y: 432,
};
/** 隐藏的位置的位置 */
const hide_pos = {
    x: 1468,
    y: 587,
};
const start_angle = 140;
/**  */
export class AlarmCtrl extends BaseCtrl {
    protected link = {} as Link;
    private count_timeout: number;
    private count_ani: FuncVoid;
    constructor(view: View) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
    }
    protected initLink() {
        const { view } = this.link;
        const { arrow, count } = view;

        this.link = {
            ...this.link,
            arrow,
            count,
            view,
        };
    }
    public reset() {
        stopAni(this.count_ani);
        clearTimeout(this.count_timeout);
        this.hide();
    }
    private show() {
        const { view: sprite } = this.link;
        Laya.SoundManager.playSound(getSoundPath('alarm'));
        sprite.visible = true;
        const end_props = {
            alpha: 1,
            ...show_pos,
        };
        tween({
            end_props,
            sprite,
        });
    }
    public countDown(count_num: number) {
        count_num = count_num || 10;
        const { view, arrow, count } = this.link;
        if (count_num > 10 && view.visible) {
            this.hide();
        }
        stopAni(this.count_ani);
        /** 初始设置，防止show的时候才慢慢变过去  */
        arrow.rotation = start_angle - (360 * count_num) / count_num;
        count.text = count_num + '';
        this.count_ani = countDown(
            count,
            count_num,
            cur_count => {
                if (cur_count <= 10) {
                    this.show();
                }
                if (cur_count <= 5) {
                    Laya.SoundManager.playSound(getSoundPath('alarm'));
                }
                if (cur_count <= 3) {
                    Laya.SoundManager.playSound(getSoundPath('countdown_second'));
                }
                tween({
                    end_props: {
                        rotation:
                            start_angle -
                            (360 * (count_num - cur_count)) / count_num,
                    },
                    sprite: arrow,
                    time: 200,
                });
                count.text = cur_count + '';
            },
            () => {
                Laya.SoundManager.playSound(getSoundPath('countdown_end'));
                this.hide();
            },
        );
    }
    private hide() {
        const { view: sprite, arrow } = this.link;
        const end_props = {
            alpha: 0,
            ...hide_pos,
        };
        return tween({
            end_props,
            sprite,
        }).then(() => {
            sprite.visible = false;
            arrow.rotation = start_angle;
        });
    }
    public destroy() {
        stopAni(this.count_ani);
        clearTimeout(this.count_timeout);
        super.destroy();
    }
}
