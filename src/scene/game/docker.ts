import { BaseCtrl } from '../../mcTree/ctrl/base';
import { tween, tweenLoop, stopAni } from '../../mcTree/utils/animate';
import { log } from '../../mcTree/utils/zutil';
import { getSoundPath } from '../../utils/tool';

export interface Link {
    view: Laya.Sprite;
    wire: Laya.Skeleton;
    tip: Laya.Sprite;
    arrow: Laya.Sprite;
    rateLabel: Laya.Label;
    smoke: Laya.Sprite;
}

/**  */
export class DockerCtrl extends BaseCtrl {
    name = 'docker_ctrl';
    private rateLevel = 0;
    private isShaking = false;
    protected link = {} as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
        this.initAni();
    }
    private initAni() {
        let wire = (this.link.wire = new Laya.Skeleton());
        wire.load(
            'animation/zhadanjiqi_mopai.sk',
            new Laya.Handler(this, () => {
                wire.stop();
                wire.pos(115, 100);
                wire.zOrder = -1;
                this.link.view.addChild(wire);
            }),
        );
        let smoke = (this.link.smoke = new Laya.Skeleton());
        smoke.load(
            'animation/zhadanjiqi_jingbao.sk',
            new Laya.Handler(this, () => {
                smoke.pos(115, 115);
                smoke.zOrder = -1;
                smoke.visible = false;
                this.link.view.addChild(smoke);
            }),
        );
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
        this.setRate(0);
    }
    /**
     * 更新抓到炸弹比率
     * @param rate 0-100
     */
    public setRate(rate: number) {
        if (isNaN(rate) || rate < 0 || rate > 100) {
            return;
        }
        const { rateLabel, arrow, wire } = this.link;
        const lastRate = parseInt(rateLabel.text);
        wire.parent && wire.play(0, false);
        // 大于25概率触发震动效果
        if (rate > 25 && !this.isShaking) {
            this.shake();
        } else if (rate <= 25 && this.isShaking) {
            this.stopShake();
        }
        //大于50概率显示烟雾
        setTimeout(() => {
            if (rate > 50) {
                this.link.smoke.visible = true;
            } else {
                this.link.smoke.visible = false;
            }
        }, 200);
        // 概率从100下降时，取消持续旋转效果
        if (lastRate === 100 && rate < 100) {
            Laya.timer.clear(this, this.arrowLoop);
            arrow.rotation = 255;
        }
        Laya.timer.frameLoop(1, this, this.setLabel, [rate]);
        this.setRateLevel(rate);
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

    /** 危险等级提高时播放音效 */
    private setRateLevel(rate) {
        let level = Math.floor(rate / 25);
        if (level == this.rateLevel) {
            return;
        }
        if (level > this.rateLevel) {
            Laya.SoundManager.playSound(getSoundPath('docker'));
        }
        this.rateLevel = level;
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
    public destroy() {
        stopAni(this.link.view);
        Laya.timer.clear(this, this.setLabel);
        Laya.timer.clear(this, this.arrowLoop);
        super.destroy();
    }
}
