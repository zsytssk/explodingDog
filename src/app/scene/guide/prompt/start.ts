import {
    callFunc
} from '../../../utils/other';
import {
    animate
} from '../../../utils/animate';
import { zutil } from '../../../utils/zutil';

import { BaseCtrl } from '../../component/base';
import { GuideCtrl } from '../main';
import { PromptGuideCtrl, i_prompguidectrl_link, t_prompt_location, t_tip_item } from './common';


interface i_startprompguidetctrl_link extends i_prompguidectrl_link {
    btn_begin: Laya.Sprite;
    guide: GuideCtrl;
}
export class StartPromptGuidetCtrl extends PromptGuideCtrl {
    link: i_startprompguidetctrl_link;
    constructor() {
        super(new ui.guide.promptStartUI());
        this.view.visible = false;
    }
    protected initLink() {
        super.initLink();

        let view = this.view;
        let btn_begin = zutil.getElementsByName(view, 'btn_begin')[0];
        let guide = zutil.queryClosest(<BaseCtrl>this, 'name:guide') as GuideCtrl;

        this.link.btn_begin = btn_begin;
        this.link.guide = guide;
    }
    start(callback?: Function) {
        let guide = this.link.guide;
        let location = {
            pos: {
                x: 208,
                y: 370
            },
            dir: 'bottom'
        } as t_prompt_location;
        let msg = "欢迎来到炮炮捕鱼！现在开始跟着我来体验游戏的魅力吧！" as t_tip_item;

        guide.showBg();
        this.prompt(location, msg, () => {
            let btn_begin = this.link.btn_begin;
            btn_begin.visible = true

            btn_begin.once(Laya.Event.CLICK, null, (event) => {
                event.stopPropagation();
                guide.hideBg();
                this.hide();
                callFunc(callback);
            });
        }, false)
    }
    hide() {
        animate.slide_down_out(this.view);
    }
}