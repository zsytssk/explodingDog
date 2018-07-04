import { BaseCtrl } from '../../mcTmpl/ctrl/base';
import { stopAni, tweenLoop } from '../../mcTmpl/utils/animate';
import { CountDown, CountInfo } from '../../mcTmpl/utils/countDown';

interface Link {
    match_view: ui.game.bannerMatchUI;
    countdown_view: ui.game.bannerCountdownUI;
    count_down_text: Laya.Text;
    light: Laya.Sprite;
}

/** 快速匹配进入游戏 匹配 + 马上要开始倒计时 */
export class QuickStartCtrl extends BaseCtrl {
    protected link = {} as Link;
    private count_down = new CountDown();
    constructor(match_view, countdown_view) {
        super();
        this.link.match_view = match_view;
        this.link.countdown_view = countdown_view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const { match_view, countdown_view } = this.link;
        this.link.count_down_text = countdown_view.text;
        this.link.light = match_view.light;
    }
    protected initEvent() {}
    public hide() {
        const { match_view, countdown_view, light } = this.link;
        match_view.visible = false;
        countdown_view.visible = false;
        stopAni(light);
    }
    public show() {
        const { match_view, countdown_view, light } = this.link;
        match_view.visible = true;
        countdown_view.visible = true;
        tweenLoop(
            light,
            { alpha: 1, scaleX: 1.2, scaleY: 1.2 },
            { alpha: 0, scaleX: 1, scaleY: 1 },
            1000,
        );
    }

    /** 设置倒计时 */
    public setCountDown(count_num: number) {
        const { count_down_text } = this.link;
        const { count_down } = this;
        count_down.start(count_num);
        count_down.onCount((data: CountInfo) => {
            count_down_text.text = data.show_delta + '';
        });
    }
}
