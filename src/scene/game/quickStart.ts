import { BaseCtrl } from '../../mcTree/ctrl/base';
import { stopAni, tweenLoop, countDown } from '../../mcTree/utils/animate';
import { GameCtrl } from './main';

interface Link {
    match_view: ui.game.bannerMatchUI;
    countdown_view: ui.game.bannerCountdownUI;
    count_down_text: Laya.Text;
    scroll_rect: Laya.Rectangle;
    light: Laya.Sprite;
    match_txt: Laya.Image;
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
    }
    protected initLink() {
        const { match_view, countdown_view } = this.link;
        this.link.count_down_text = countdown_view.text;
        this.link.light = match_view.light;
        this.link.match_txt = match_view.txt;
        const scrollRect = new Laya.Rectangle(0, 0, 255, 66);
        this.link.match_txt.scrollRect = scrollRect;
        this.link.scroll_rect = scrollRect;
    }
    public hide() {
        const { match_view, countdown_view, light, scroll_rect } = this.link;
        match_view.visible = false;
        countdown_view.visible = false;
        stopAni(light);
        stopAni(scroll_rect);
    }
    public hideCountDown() {
        this.link.countdown_view.visible = false;
    }
    public show() {
        const { match_view, light, scroll_rect, match_txt } = this.link;
        match_view.visible = true;
        tweenLoop({
            props_arr: [
                { alpha: 1, scaleX: 1.2, scaleY: 1.2 },
                { alpha: 0, scaleX: 1, scaleY: 1 },
            ],
            sprite: light,
            time: 1000,
        });
        this.setTxt();
        // tweenLoop({
        //     is_jump: true,
        //     props_arr: [
        //         // { width: 210 },
        //         // { width: 225 },
        //         // { width: 240 },
        //         // { width: 255 },
        //         { width: match_txt.width - 45 },
        //         { width: match_txt.width - 30 },
        //         { width: match_txt.width - 15 },
        //         { width: match_txt.width },
        //     ],
        //     sprite: scroll_rect,
        //     time: 500,
        // });
    }

    /** 设置倒计时 */
    public countDown(count_num: number) {
        if (!count_num) {
            return;
        }
        const { count_down_text, countdown_view } = this.link;
        countDown(count_down_text, count_num, count => {
            count_down_text.text = count + '';
        });

        countdown_view.visible = true;
    }
    public reset() {
        const { scroll_rect, light } = this.link;
        stopAni(scroll_rect);
        stopAni(light);
    }
    public setTxt() {
        const game_ctrl = this.parent as GameCtrl;
        const userCount = game_ctrl.getPlayerNum();
        const { scroll_rect, match_txt } = this.link;
        if (userCount == 1) {
            match_txt.skin = 'images/game/txt_matching_dot.png';
        } else if (userCount == 5) {
            match_txt.skin = 'images/game/txt_shuffle.png';
        } else {
            match_txt.skin = 'images/game/txt_waiting_users.png';
        }
        stopAni(match_txt)
        tweenLoop({
            is_jump: true,
            props_arr: [
                { width: match_txt.width - 45 },
                { width: match_txt.width - 30 },
                { width: match_txt.width - 15 },
                { width: match_txt.width },
            ],
            sprite: scroll_rect,
            time: 500,
        });
    }
}
