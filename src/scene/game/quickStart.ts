import { BaseCtrl } from '../../mcTree/ctrl/base';
import { stopAni, tweenLoop } from '../../mcTree/utils/animate';
import { CountDown, CountInfo } from '../../mcTree/utils/countDown';

interface Link {
    match_view: ui.game.bannerMatchUI;
    countdown_view: ui.game.bannerCountdownUI;
    count_down_text: Laya.Text;
    scroll_rect: Laya.Rectangle;
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
    }
    protected initLink() {
        const { match_view, countdown_view } = this.link;
        this.link.count_down_text = countdown_view.text;
        this.link.light = match_view.light;
        const match_txt = match_view.txt;
        const scrollRect = new Laya.Rectangle(0, 0, 255, 66);
        match_txt.scrollRect = scrollRect;
        this.link.scroll_rect = scrollRect;
    }
    public hide() {
        const { count_down } = this;
        const { match_view, countdown_view, light, scroll_rect } = this.link;
        match_view.visible = false;
        countdown_view.visible = false;
        stopAni(light);
        stopAni(scroll_rect);
        count_down.clear();
    }
    public show() {
        const { match_view, light, scroll_rect } = this.link;
        match_view.visible = true;
        tweenLoop({
            props_arr: [
                { alpha: 1, scaleX: 1.2, scaleY: 1.2 },
                { alpha: 0, scaleX: 1, scaleY: 1 },
            ],
            sprite: light,
            time: 1000,
        });
        tweenLoop({
            is_jump: true,
            props_arr: [
                { width: 210 },
                { width: 225 },
                { width: 240 },
                { width: 255 },
            ],
            sprite: scroll_rect,
            time: 500,
        });
    }

    /** 设置倒计时 */
    public countDown(count_num: number) {
        if (!count_num) {
            return;
        }
        const { count_down_text, countdown_view } = this.link;
        const { count_down } = this;

        countdown_view.visible = true;
        count_down.start(count_num);
        count_down.onCount((data: CountInfo) => {
            count_down_text.text = data.show_time + '';
        });
    }
}
