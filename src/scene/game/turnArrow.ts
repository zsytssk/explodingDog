import { BaseCtrl } from '../../mcTree/ctrl/base';
import { getChildren } from '../../mcTree/utils/zutil';
import { tween } from '../../mcTree/utils/animate';

export interface Link {
    view: Laya.Node;
}

/** 指示箭头 */
export class TurnArrowCtrl extends BaseCtrl {
    name = 'turn_arrow_ctrl';
    protected link = {} as Link;
    private currentArrowBox: Laya.Box;
    /**0.顺时针1.逆时针 */
    private currentTurn = '0';
    private arrowIndex = 0;
    private loop_time = 300;
    private timer = new Laya.Node();
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
        for (let i = 3; i < 6; i++) {
            let arrowBox = this.link.view.getChildByName('arrow' + i);
            getChildren(arrowBox).forEach(item => {
                item.getChildAt(0).alpha = 0;
            })
        }
    }
    protected initLink() { }
    protected initEvent() { }
    public loadModel() { }

    /**
     * 显示箭头
     * @param playerCount 玩家数
     */
    public showArrow(playerCount: number) {
        const arrowBox = this.link.view.getChildByName(
            'arrow' + playerCount,
        ) as Laya.Box;
        if (arrowBox) {
            this.currentArrowBox = arrowBox;
            arrowBox.visible = true;
        }
        Laya.timer.loop(this.loop_time, this, this.arrowBlink);
    }

    /**
     *
     * @param clockWise '0':顺时针方向'1':逆时针
     */
    public rotate(clockWise) {
        if (!this.currentArrowBox || clockWise == this.currentTurn) {
            return;
        }
        this.currentTurn = clockWise;
        Laya.timer.clear(this, this.arrowBlink);
        if (clockWise == '0') {
            this.arrowIndex = 0;
        } else {
            this.arrowIndex = getChildren(this.currentArrowBox).length - 1;
        }
        this.timer.timerOnce(this.loop_time, this, () => {
            let delay = 1000;
            getChildren(this.currentArrowBox).forEach(item => {
                let arrow = item.getChildAt(0);
                arrow.alpha = 1;
                let changeRotation = clockWise == '0' ? -180 : 180;
                tween({
                    sprite: arrow,
                    end_props: { rotation: arrow.rotation + changeRotation },
                    time: delay,
                    ease_fn: Laya.Ease.backOut
                });
            });
            this.timer.timerOnce(delay, this, () => {
                getChildren(this.currentArrowBox).forEach(item => {
                    let arrow = item.getChildAt(0);
                    arrow.alpha = 0;
                });
                Laya.timer.loop(this.loop_time, this, this.arrowBlink);
            });
        });
    }

    private arrowBlink() {
        if (!this.currentArrowBox) {
            return;
        }
        if (this.arrowIndex >= getChildren(this.currentArrowBox).length) {
            this.arrowIndex = 0;
        }
        if (this.arrowIndex < 0) {
            this.arrowIndex = getChildren(this.currentArrowBox).length - 1;
        }
        let arrow = this.currentArrowBox.getChildAt(this.arrowIndex).getChildAt(0);
        Laya.Tween.from(arrow, { alpha: 1 }, 400);
        if (this.currentTurn == '0') {
            this.arrowIndex += 1;
        } else {
            this.arrowIndex -= 1;
        }
    }

    destroy() {
        Laya.timer.clear(this, this.arrowBlink);
        this.timer.destroy();
        super.destroy();
    }
}
