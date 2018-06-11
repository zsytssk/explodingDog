import { CMD } from '../../data/cmd';
import {
    isFunc,
    callFunc
} from '../../utils/other';
import { zutil } from '../../utils/zutil';

import { BaseCtrl } from '../component/base';
import { AppCtrl } from '../app';
import { RouterCtrl, t_router_enter_data } from '../network/router';
import { GameNormalCtrl } from '../room/normal/game';
import { HallCtrl } from '../hall/main';
import { AlertCtrl } from '../pop/alert';
import { TipCtrl } from '../pop/tip';
import { ShootGuideCtrl } from './shoot/main';
import { FishTicketGuideCtrl } from './fishticket';
import { ExchangeGuideCtrl } from './exchange';

import { GuideProcess, t_guideprocess_link } from './common';
import { GUIDE_DATA } from './data';
import { PromptGuideCtrl, t_prompt_location, t_tip_item } from './prompt/common';
import { StartPromptGuidetCtrl } from './prompt/start';
import { EndPromptGuidetCtrl } from './prompt/end';
import { PointerGuidetCtrl, t_pointer_type } from './pointer';
import { QuickStartGuideCtrl } from './quickStart';

interface i_guidectrl_link extends t_guideprocess_link {
    app: AppCtrl;
    router: RouterCtrl;
    pointer: PointerGuidetCtrl;
    prompt: PromptGuideCtrl;
    start_prompt: StartPromptGuidetCtrl;
    end_prompt: EndPromptGuidetCtrl;
    bg: Laya.Sprite;
    alert: AlertCtrl;
    tip: TipCtrl;
}

type t_guide_info = {
    stage: string;
    step: number;
}
type t_guide_step_obj = {
    name: string;
    step: number;
}
type t_guide_step = number | t_guide_step_obj;

export let guide_order_list = [
    "quick_start",
    "shoot::small_fish",
    "shoot::upgrade_gun",
    "shoot::big_fish",
    "fish_ticket::0",
    "fish_ticket::1",
    "fish_ticket::2",
    "fish_ticket::3",
    "exchange::0",
    "exchange::1"
];

/**新手引导 */
export class GuideCtrl extends GuideProcess {
    public cur_pos: t_guide_info;
    protected display_style: DisplayStyle = 'on_box';
    readonly name = 'guide';
    protected link: i_guidectrl_link;
    constructor() {
        super(ui.guide.mainUI);
    }
    public init(callback?) {
        this.loadRes(() => {
            super.init();
            this.initView();
            this.initLink();
            this.initEvent();
            this.hide();
            this.resize();
            if (isFunc(callback)) {
                callback();
            }
        });
    }
    protected initLink() {
        super.initLink();

        let view = this.view;
        let app = zutil.queryClosest(<BaseCtrl>this, 'name:app') as AppCtrl;
        let router = zutil.getElementsByName(<BaseCtrl>app, 'router')[0] as RouterCtrl;
        let bg = zutil.getElementsByName(view, 'bg')[0];
        let content_box = zutil.getElementsByName(view, 'content_box')[0];

        /**提示框 */
        let prompt_ctrl = new PromptGuideCtrl();
        prompt_ctrl.zOrder = 1;
        this.addChild(prompt_ctrl);
        prompt_ctrl.init();

        /**开始提示框 */
        let prompt_start_ctrl = new StartPromptGuidetCtrl();
        prompt_start_ctrl.zOrder = 1;
        this.addChild(prompt_start_ctrl);
        prompt_start_ctrl.init();

        /**结束提示框 */
        let prompt_end_ctrl = new EndPromptGuidetCtrl();
        prompt_end_ctrl.zOrder = 1;
        this.addChild(prompt_end_ctrl);
        prompt_end_ctrl.init();

        /**手型 */
        let pointer_ctrl = new PointerGuidetCtrl();
        pointer_ctrl.zOrder = 1;
        this.addChild(pointer_ctrl);
        pointer_ctrl.init();

        /**开始 */
        let quick_start_dom = zutil.getElementsByName(view, 'quick_start')[0];
        let quick_start_ctrl = new QuickStartGuideCtrl(quick_start_dom);
        this.addChild(quick_start_ctrl);
        quick_start_ctrl.init();

        /**击杀鱼 */
        let shoot_dom = zutil.getElementsByName(view, 'shoot')[0];
        let shoot_ctrl = new ShootGuideCtrl(shoot_dom);
        this.addChild(shoot_ctrl);
        shoot_ctrl.init();

        /**鱼券抽奖 */
        let fish_ticket_dom = zutil.getElementsByName(view, 'fish_ticket')[0];
        let fish_ticket_ctrl = new FishTicketGuideCtrl(fish_ticket_dom);
        this.addChild(fish_ticket_ctrl);
        fish_ticket_ctrl.init();

        /**兑换商城 */
        let exchange_dom = zutil.getElementsByName(view, 'exchange')[0];
        let exchange_ctrl = new ExchangeGuideCtrl(exchange_dom);
        this.addChild(exchange_ctrl);
        exchange_ctrl.init();

        this.sub_process_list = [quick_start_ctrl, shoot_ctrl, fish_ticket_ctrl, exchange_ctrl];

        this.link.app = app;
        this.link.router = router;
        this.link.pointer = pointer_ctrl;
        this.link.prompt = prompt_ctrl;
        this.link.start_prompt = prompt_start_ctrl;
        this.link.end_prompt = prompt_end_ctrl;
        this.link.bg = bg;

        this.bindPrimusEventHandler(this.transferData.bind(this));
    }
    /** 窗口自适应*/
    protected resize() {
        let view = this.view;
        let bg = this.link.bg;
        let screen_width = Laya.stage.width;
        let screen_height = Laya.stage.height;

        bg.width = screen_width;
        bg.height = screen_height;
    }
    private initEvent() {
        this.view.on(Laya.Event.CLICK, null, (event: laya.events.Event) => {
            event.stopPropagation();
            /**处理提示信息跳过显示 */
            let prompt_arr = zutil.getElementsByName(<BaseCtrl>this, 'prompt') as PromptGuideCtrl[];
            for (let i = 0; i < prompt_arr.length; i++) {
                if (prompt_arr[i].isTiping) {
                    prompt_arr[i].showCompletedTip();
                    return;
                }
            }

            /**处理手型提示 */
            this.movePointerToTarget({
                x: event.stageX,
                y: event.stageY
            });
        });
        this.bindOtherEvent(this.link.primus, CMD.server_disconnect, () => {
            this.destroy();
        }, true);

        /**服务器段报错 要提示信息 要将自己层级下调到pop_wrap下面, 提示关闭层级调到pop_wrap上面*/
        this.bindOtherEvent(this.link.primus, CMD.global_error, () => {
            let app = this.link.app;
            if (!this.link.alert) {
                let alert = zutil.getElementsByName(<BaseCtrl>app, 'alert')[0] as AlertCtrl;
                if (!alert) {
                    return;
                }
                this.bindOtherEvent(alert, CMD.global_shown, () => {
                    this.zOrder = 4;
                });
                this.link.alert = alert;
            }
            if (!this.link.tip) {
                let tip = zutil.getElementsByName(<BaseCtrl>app, 'tip')[0] as TipCtrl;
                if (!tip) {
                    return;
                }
                this.bindOtherEvent(tip, CMD.global_shown, () => {
                    this.zOrder = 4;
                });
                this.link.tip = tip;
            }
        });

        this.on(CMD.global_resize, () => {
            this.resize();
        });

        this.bindOtherEvent(this.link.router, CMD.router_enter, (data: t_router_enter_data) => {
            /**进入大厅关闭guideview只有在 每日抽奖弹出层关闭的时候才出现 */
            if (data.router_path == '/hall') {
                this.hide();
                this.bindOtherEvent(this.link.app, CMD.app_dayRoulette_hidden, () => {
                    this.show();
                });
                return;
            }
            this.show();
        })
    }
    public jumpToStep(step: number) {
        let process_path = guide_order_list[step] as string;
        if (!process_path) {
            zutil.logErr(`guide:: can't find process at ${step}`);
            return;
        }
        // this.show();
        let process_list = process_path.split('::');
        this.start(() => {
            this.goto(process_list);
        });
    }
    /**转换数据 */
    private transferData(event: string, data?: any) {
        let has_handler = false;
        switch (event) {
            /**发射子弹 */
            case CMD.server_room_init:
                this.handleRoomInData(event, data);
                has_handler = true;
                break;
        }
        return has_handler;
    }

    /**处理进入房间初始化数据*/
    private handleRoomInData(event: string, data?: any) {
        let room_init_data = GUIDE_DATA.room_init;

        /**获取用户真实的金钱 */
        this.emitToPrimus(CMD.userAmount, null, (data) => {
            room_init_data.users[0].gold = data.gold;
            room_init_data.users[0].diamond = data.diamond;

            this.sendDataToPrimus(event, room_init_data);
        });
    }

    public getData(event_name) {
        return GUIDE_DATA[event_name]
    }
    /**关闭新手引导 */
    public close() {
        this.destroy();
    }
    public showBg() {
        this.link.bg.visible = true;
    }
    public hideBg() {
        this.link.bg.visible = false;
    }
    /**检测router是否进入特定的页面 */
    public checkRouter(path, callback: Function) {
        let app = this.link.app;
        let router = this.link.router;
        let cur_path = router.director.cur_router.path;
        let is_entered = router.is_entered;
        /**如果已经进入页面直接调用返回函数 */
        if (is_entered && cur_path == path) {
            callFunc(callback);
            return;
        }

        if (cur_path != path) {
            this.report(CMD.app_goto_page, 'app', { page: path });
        }

        /**没有进入页面 等待进入 */
        this.bindOtherEvent(router, CMD.router_enter, (data: t_router_enter_data) => {
            if (data.router_path == path && data.is_completed) {
                /**进入大厅要等到每日抽奖关闭之后才开始 */
                if (path == '/hall') {
                    this.bindOtherEvent(app, CMD.app_dayRoulette_hidden, () => {
                        callFunc(callback);
                    }, true);
                    return;
                }
                this.offOtherEvent(router);
                callFunc(callback);
            }
        });
    }
    /**检测房间是否开启 */
    public checkRoomOPen(callback: Function) {
        this.checkRouter('/room/normal', () => {
            let app = this.link.app;
            let game = zutil.getElementsByName(<BaseCtrl>app, 'game')[0] as GameNormalCtrl;

            if (game.status == 'open') {
                callFunc(callback);
            }

            let bindFn = this.bindOtherEvent(game, CMD.status_change, (data) => {
                if (data.status == 'open') {
                    callFunc(callback);
                    bindFn.off();
                }
            }, true)
        });
    }
    public showPrompt(location: t_prompt_location, tip: t_tip_item | t_tip_item[], callback?: Function) {
        this.link.prompt.prompt(location, tip, callback);
    }
    public hidePrompt() {
        this.link.prompt.hide();
    }
    /** 开始提示 */
    public showStartPrompt(callback: Function) {
        this.link.start_prompt.start(callback);
    }
    /** 最后进入游戏提示 */
    public showEndPrompt(callback?: Function) {
        this.link.end_prompt.start(callback);
    }
    /**手指移动指向某个点 */
    public movePointerToTarget(start_p: t_point, end_p?: t_point) {
        let pointer = this.link.pointer;
        pointer.moveToTarget(start_p, end_p);
    }
    public showPointer(pos: t_point, type?: t_pointer_type) {
        let pointer = this.link.pointer;
        pointer.show(pos, type);
    }
    public hidePointer() {
        let pointer = this.link.pointer;
        pointer.hidePointer();
    }
    public start(callback?: Function) {
        this.emitToPrimus(CMD.server_get_guide_info, null, (data) => {
            zutil.log('guide:>', data);
            GUIDE_DATA.server_data = data;

            super.start(callback);
        })
    }
    public complete() {
        let app = this.link.app;
        let hall = zutil.getElementsByName(<BaseCtrl>app, 'hall')[0] as HallCtrl;
        app.quitGuide();
        hall.quickEnter();

        super.complete();
    }
    public setGuideStep(step: t_guide_step, callback?: Function) {
        let recordPoint: number;
        let recordName: string;
        if (typeof step == 'number') {
            recordPoint = step;
        } else {
            recordPoint = step.step;
            recordName = step.name;
        }
        this.emitToPrimus(CMD.server_set_guide_step, { recordPoint: recordPoint, recordName: recordName }, (data: t_server_guide_data) => {
            if (!data || data.status != "1") {
                zutil.logErr('guide:> server set step failed!');
            }
            if (callback) {
                callback(data.content);
            }
        });
    }
}