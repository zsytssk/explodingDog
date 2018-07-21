import { BaseCtrl } from '../../mcTree/ctrl/base';
import { tween, tweenLoop, stopAni } from '../../mcTree/utils/animate';

export interface Link {
    view: Laya.Sprite;
    wire: Laya.Sprite;
    tip: Laya.Sprite;
    arrow: Laya.Sprite;
    rateLabel: Laya.Label;
}

/**  */
export class DockerCtrl extends BaseCtrl {
    private isShaking = false;
    protected link = {} as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const view = this.link.view as any;
        const wire = view.wire;
        const tip = view.tip;
        const arrow = view.arrow;

        this.link.wire = wire;
        this.link.tip = tip;
        this.link.arrow = arrow;
        this.link.rateLabel = view.rateLabel;
    }
    protected initEvent() {}
    public start() {
        const { wire, tip, arrow } = this.link;
        wire.visible = true;
        tip.visible = true;
        arrow.visible = true;
    }
    public reset() {
        const { wire, tip, arrow } = this.link;
        wire.visible = false;
        tip.visible = false;
    }
    /**
     * 更新抓到炸弹比率
     * @param rate 0-100
     */
    public setRate(rate: number) {
        if (isNaN(rate) || rate < 0 || rate > 100) {
            return;
        }
        const { rateLabel, arrow } = this.link;
        const lastRate = parseInt(rateLabel.text);
        // 大于20概率触发震动效果
        if (rate > 20 && !this.isShaking) {
            this.shake();
        } else if (rate <= 20 && this.isShaking) {
            this.stopShake();
        }
        // 概率从100下降时，取消持续旋转效果
        if (lastRate === 100 && rate < 100) {
            Laya.timer.clear(this, this.arrowLoop);
            arrow.rotation = 255;
        }
        Laya.timer.frameLoop(1, this, this.setLabel, [rate]);
    }
    private setLabel(rate: number) {
        const { rateLabel, arrow } = this.link;
        let lastRate = parseInt(rateLabel.text);
        if (rate === lastRate) {
            Laya.timer.clear(this, this.setLabel);
            if (rate === 100) {
                // 100概率时箭头持续旋转
                Laya.timer.frameLoop(1, this, this.arrowLoop);
            }
            return;
        }
        // 箭头角度-30~255
        if (rate > lastRate) {
            rateLabel.text = '' + ++lastRate;
            arrow.rotation += 2.85;
        } else {
            rateLabel.text = '' + --lastRate;
            arrow.rotation -= 2.85;
        }
    }

    private arrowLoop() {
        const { arrow } = this.link;
        arrow.rotation += 25;
    }

    private shake() {
        const view = this.link.view;
        this.isShaking = true;
        tweenLoop({
            ease_fn: Laya.Ease.bounceInOut,
            props_arr: [{ y: view.y + 3 }, { y: view.y - 3 }],
            sprite: view,
            time: 40,
        });
    }
    private stopShake() {
        this.isShaking = false;
        const view = this.link.view;
        stopAni(view);
    }
}
