import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { tween, countDown, stopAni } from '../../../mcTree/utils/animate';

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
    public preCountDown() {
        this.count_timeout = setTimeout(() => {
            this.show(12);
        }, 8000);
    }
    public clear() {
        stopAni(this.count_ani);
        clearTimeout(this.count_timeout);
        this.hide();
    }
    private show(count: number) {
        const { view: sprite } = this.link;
        const end_props = {
            alpha: 1,
            ...show_pos,
        };
        this.countDown(count);
        tween({
            end_props,
            sprite,
        });
    }
    private countDown(count_num: number) {
        count_num = count_num || 10;
        const { arrow, count } = this.link;

        stopAni(this.count_ani);
        this.count_ani = countDown(
            count,
            count_num,
            cur_count => {
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
            arrow.rotation = start_angle;
        });
    }
    public destroy() {
        this.clear();
    }
}
