import { BaseCtrl } from '../../mcTmpl/ctrl/base';

interface Link {
    match_view: Laya.Sprite;
    countdown_view: Laya.Sprite;
    count_down_text: Laya.Text;
}

/** 快速匹配进入游戏 匹配 + 马上要开始倒计时 */
export class QuickStartCtrl extends BaseCtrl {
    protected link = {} as Link;
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
        this.link.count_down_text = (countdown_view as any).text;
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
    public setCountDown(count_down: number) {
        const { count_down_text } = this.link;
        count_down_text.text = count_down + '';
    }
}