import { BaseCtrl } from '../../component/base';
import {
    callFunc
} from '../../../utils/other';
import { zutil } from '../../../utils/zutil';
import { AppCtrl } from '../../app';
import { GuideCtrl } from '../main';
import { HallCtrl } from '../../hall/main';
import { PromptGuideCtrl, i_prompguidectrl_link, t_prompt_location, t_tip_item } from './common';

interface i_endprompguidetctrl_link extends i_prompguidectrl_link {
    btn_goto: Laya.Sprite;
    hall: HallCtrl;
    app: AppCtrl;
}

/**新手引导结束 提示弹层 */
export class EndPromptGuidetCtrl extends PromptGuideCtrl {
    link: i_endprompguidetctrl_link;
    constructor() {
        super(new ui.guide.promptEndUI());
        this.view.visible = false;
    }
    protected initLink() {
        super.initLink();

        let view = this.view;
        let btn_goto = zutil.getElementsByName(view, 'btn_goto')[0];
        let app = zutil.queryClosest(<BaseCtrl>this, 'name:app') as AppCtrl;

        this.link.btn_goto = btn_goto;
        this.link.app = app;
    }
    start(callback?: Function) {
        let location = {
            pos: {
                x: 293,
                y: 252
            },
            dir: 'left'
        } as t_prompt_location;
        let msg = "现在让我们去捕获更多奖金鱼, 收集更多话费券吧! " as t_tip_item;
        this.prompt(location, msg, () => {
            let btn_goto = this.link.btn_goto;
            btn_goto.visible = true

            btn_goto.once(Laya.Event.CLICK, null, (event) => {
                event.stopPropagation();
                this.hide();
                callFunc(callback);
            });
        }, false);
    }
}