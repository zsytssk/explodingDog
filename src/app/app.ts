import { load_util } from '../utils/load';
import { AppRouterConfig } from './app.routerConfig';
import { AudioCtrl } from './audio';
import { BackgroundMonitor } from './backgroundMonitor';
import { NodeCtrl } from './component/node';
import { RouterOutsetCtrl } from './component/routerOutset';
import { CONFIG } from './data/config';
import { RESMAP } from './data/resmap';
import { AjaxCtrl } from './network/ajax';
import { PrimusCtrl } from './network/primus';
import { RouterCtrl } from './network/router';

interface AppLink {
    /** Primus控制器 */
    primus_ctrl: PrimusCtrl;
    /** ajax控制器 */
    ajax_ctrl: AjaxCtrl;
    /** 路由控制器 */
    router_ctrl: RouterCtrl;
    /** 声音控制器 */
    audio_ctrl: AudioCtrl;
    /** 后台检测控制器 */
    background_monitor_ctrl: BackgroundMonitor;
}
export const cmd = {
    resize: 'resize',
    play_audio: 'play_audio',
    initialized: 'initialized',
};

export class AppCtrl extends NodeCtrl {
    public readonly name = 'app';
    protected link = {} as AppLink;
    protected is_top = true;
    private router_config: AppRouterConfig;
    constructor() {
        super(Laya.stage);
    }
    public init() {
        this.initLink();
        this.initEvent();

        /** 初始化完成之后发送initialized事件 */
        this.createTimeout(() => {
            this.emit(cmd.initialized);
        }, 0);
    }
    protected initLink() {
        // socket
        const config = {
            token: CONFIG.token,
            user_id: CONFIG.user_id,
            public_key: CONFIG.public_key,
            server_url: CONFIG.websocket_url,
        };
        const primus_ctrl = new PrimusCtrl(config);
        this.addChild(primus_ctrl);
        primus_ctrl.init();
        this.link.primus_ctrl = primus_ctrl;

        // const ajax_ctrl = new AjaxCtrl();
        // this.addChild(ajax_ctrl);
        // ajax_ctrl.init();
        // this.link.ajax_ctrl = ajax_ctrl;

        // const audio_ctrl = new AudioCtrl();
        // this.addChild(audio_ctrl);
        // audio_ctrl.init();
        // this.link.audio_ctrl = audio_ctrl;

        // // background_monitor
        // const background_monitor = new BackgroundMonitor(
        //     CONFIG.background_logout_time * 1000,
        // );
        // background_monitor.bindEnterBackground(() => {
        //     primus_ctrl.disConnect();
        // });
        // this.link.background_monitor_ctrl = background_monitor;

        // router_outset
        const router_outset_ctrl = new RouterOutsetCtrl();
        this.addChild(router_outset_ctrl);
        router_outset_ctrl.init();

        // router
        const router_ctrl = new RouterCtrl();
        this.addChild(router_ctrl);
        router_ctrl.init();
        this.link.router_ctrl = router_ctrl;

        this.router_config = new AppRouterConfig(router_ctrl, '/');
        load_util.setResmap(RESMAP);
    }
    protected initEvent() {}
}
