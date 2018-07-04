import { BaseCtrl } from '../../mcTmpl/ctrl/base';
import { CountDown, CountInfo } from '../../mcTmpl/utils/countDown';

interface Link {
    match_view: ui.game.bannerMatchUI;
    countdown_view: ui.game.bannerCountdownUI;
    count_down_text: Laya.Text;
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
        const { countdown_view } = this.link;
        this.link.count_down_text = countdown_view.text;
    }
    protected initEvent() {}
    public hide() {
        const { match_view, countdown_view } = this.link;
        match_view.visible = false;
        countdown_view.visible = false;
    }
    public show() {
        const { match_view, countdown_view } = this.link;
        match_view.visible = true;
        countdown_view.visible = true;
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
