import { CMD } from '../data/cmd';
import { RES } from '../data/res';
import { RESMAP, t_load_style } from '../data/resmap';
import { CONFIG } from '../data/config';
import { isFunc, callFunc } from '../utils/other';
import { animate } from '../utils/animate';
import { zutil } from '../utils/zutil';

import { AppCtrl } from './app';
import { SceneCtrl } from './component/scence';
import { NodeCtrl } from './component/node';

/*ctrl节点的生命周期 */
type t_life_status = 'noInit' | 'initing' | 'inited' | 'destroyed';
interface i_loadctrl_link {
    progress_bar: Laya.ProgressBar;
    bg_ani: laya.ani.bone.Skeleton;
    con: Laya.Sprite;
    cover: Laya.Sprite;
    cover_anis: laya.ani.bone.Skeleton[];
}
/**加载队列*/
type load_item = {
    res?: any[];
    /**加载完成之后需要执行的函数 */
    end_listener?: Function;
    load_style?: t_load_style;
    /**是否是界面弹层, 在加载完成之后关闭loadCtrl*/
    is_scene?: boolean;
    /**所属的ctrl名称 */
    ctrl_name?: string;
    type: 'dependency' | 'relative';
    status?: t_resource_status;
    order: number;
};
/**loading的状态 空闲 正在加载*/
type t_load_status = 'stop' | 'loading';
/**load控制器*/
export class LoadCtrl extends SceneCtrl {
    public view: Laya.Sprite;
    protected link: i_loadctrl_link;
    public display_style: t_display_style = 'on_box';
    public load_style: t_load_style = 'in_background';
    private status: t_load_status = 'stop';
    private loader = Laya.loader;
    private load_queue: load_item[] = [];
    /**正在加载的资源*/
    private loading_item: load_item;
    private is_showing: boolean = false;
    /**记录显示的时间 用来计算显示的时间和最小显示时间的的大小*/
    private showing_timestamp: number;
    /**控制最小显示时间的倒计时*/
    private hide_time_out: number;
    /**隐藏cover倒计时*/
    private hide_cover_timeout: number;
    /**生命周期 */
    protected life_status: t_life_status = 'noInit';
    readonly name = 'load';
    /**load控制器*/
    constructor() {
        super(ui.loadUI);
    }
    /** 初始化
     * @param {Function} callback
     */
    public enter(callback?: Function) {
        if (this.life_status != 'noInit') {
            return;
        }
        this.life_status = 'initing';
        this.load(this, () => {
            this.initView();
            this.initLink();
            this.initEvent();
            this.life_status = 'inited';
            if (callback && typeof callback == 'function') {
                callback();
            }
        });
    }
    public initLink() {
        let view = this.view;
        let progress_bar = <Laya.ProgressBar>(
            zutil.getElementsByName(view, 'progress_bar')[0]
        );

        let con = zutil.getElementsByName(view, 'con')[0];
        let bg_ani = zutil.getElementsByName(
            view,
            'bg_ani',
        )[0] as laya.ani.bone.Skeleton;
        let cover = zutil.getElementsByName(view, 'cover')[0];
        let cover_anis = zutil.getElementsByName(
            view,
            'cover_ani',
        ) as laya.ani.bone.Skeleton[];

        /**默认停止所有动画*/
        bg_ani.paused();
        for (let i = 0; i < cover_anis.length; i++) {
            cover_anis[i].paused();
        }

        this.link.progress_bar = progress_bar;
        this.link.con = con;
        this.link.bg_ani = bg_ani;
        this.link.cover = cover;
        this.link.cover_anis = cover_anis;
    }
    public initEvent() {
        this.on(CMD.global_resize, () => {
            this.resize();
        });
    }
    /** 显示load页面进度条变化加载资源;
     * 应该只有在加载scence的时候才需要使用
     */
    /** 页面大小变化时 页面内容始终居中 */
    protected resize() {
        let view = this.view;
        if (!view) {
            return true;
        }
        view.y = (Laya.stage.height - view.height) / 2;
    }
    /**
     * 加载资源之后执行返回函数
     * @param ctrl 需要加载资源的控制器
     * @param callback 返回函数
     */
    public load(ctrl: NodeCtrl, callback?: Function) {
        /**如果load本身没有加载 加载load初始化之后继续执行*/
        if (ctrl != this && this.resource_status == 'unload') {
            this.enter();
        }
        // zutil.log('load_ctrl::load', ctrl.name);

        /**将资源添加到load_que中*/
        this.addCtrlToQueue(ctrl, callback);
        /**如果load没有正在加载的资源, 启动记载*/
        if (this.status == 'stop') {
            this.status = 'loading';
            this.loadingQueue();
        }
    }
    /**
     * 加依赖资源
     */
    private loadingQueue() {
        let load_queue = this.load_queue;
        let loader = this.loader;
        if (load_queue.length == 0) {
            this.status = 'stop';
            zutil.log('load_queue is empty, all res is loaded');
            return;
        }

        this.loading_item = load_queue.shift();
        let res = this.loading_item.res;
        let callback = this.loading_item.end_listener;
        let status = this.loading_item.status;
        let load_style = this.loading_item.load_style;
        let is_scene = this.loading_item.is_scene;

        let loading_item = this.loading_item;
        // if (loading_item.type != 'relative') {  //debug
        // zutil.log('load_ctrl::loading_item', loading_item.ctrl_name, loading_item);
        // }
        let new_callback = () => {
            // if (loading_item.type != 'relative') {  //debug
            // zutil.log('load_ctrl::loaded_item', loading_item.ctrl_name, loading_item);
            // }
            /**loader.clearUnLoaded 有时并不能停止正在加载的资源
             * 导致多个加载队列同时进行, 会导致我的load过程中黑屏bug
             * 如果当前加载结束的元素和正在加载的元素和不一样,
             * 说明在插入加载资源的时候stopLoadQue并没有停止,
             * 所以这里的所有操作并不需要去进行
             */
            if (this.loading_item != loading_item) {
                return;
            }
            this.loading_item = null;
            this.checkHide(loading_item);

            callFunc(callback);
            this.loadingQueue();
        };

        /**如果资源已经加载 | 没有资源 | 资源为空 直接调用callback*/
        if (!res || res.length == 0 || status == 'loaded') {
            if (load_style == 'show_loading') {
                this.toggleCover(new_callback);
            } else {
                new_callback();
            }
            return;
        }

        /**正在加载函数*/
        let loading_callback: Laya.Handler = null;
        /**加载完成执行函数*/
        let loaded_callback: Laya.Handler = Laya.Handler.create(
            this,
            new_callback,
        );

        if (load_style == 'show_loading') {
            if (!this.is_showing) {
                this.show();
            }
            loading_callback = Laya.Handler.create(
                this,
                this.showLoadingProgress,
                null,
                false,
            );
        }

        this.loadItem(res, loaded_callback, loading_callback);
    }
    /**
     * 在每次加载结束之后检测是否要关闭load
     * 如果room-->game这时候如果只有在room加载之后同时异步之后
     * 才会去加载game res, 这中间加载的对象会被后来的挤下来
     * 这就是为什么会在异步400毫秒之后去执行这个判断
     */
    private checkHide(loading_item) {
        let load_queue = this.load_queue;
        setTimeout(() => {
            /**如果load显示, 默认关闭,只有在下一个loaditem需要显示才不关闭*/
            let hide_load = this.is_showing;
            if (
                this.loading_item &&
                this.loading_item.load_style == 'show_loading'
            ) {
                hide_load = false;
            }
            if (hide_load) {
                this.onLoaded();
            }
        }, 400);
    }
    /**
     * 在每次加载结束之后检测是否要关闭load
     * 如果room-->game这时候如果只有在room加载之后同时异步之后
     * 才会去加载game res, 这中间加载的对象会被后来的挤下来
     * 这就是为什么会在异步400毫秒之后去执行这个判断
     */
    private checkHide(loading_item) {
        let load_queue = this.load_queue;
        setTimeout(() => {
            /**如果load显示, 默认关闭,只有在下一个loaditem需要显示才不关闭*/
            let hide_load = this.is_showing;
            if (
                this.loading_item &&
                this.loading_item.load_style == 'show_loading'
            ) {
                hide_load = false;
            }
            if (hide_load) {
                this.onLoaded();
            }
        }, 400);
    }
    /**
     * 加载单个item资源
     * @param res 加载的资源
     * @param callback 加载的完成之后便执行的返回函数
     */
    private loadItem(
        res: any[],
        loaded_callback: Laya.Handler,
        loading_callback: Laya.Handler,
    ) {
        /**空的资源列表 直接执行返回函数 */
        if (!res.length) {
            loaded_callback.run();
            return;
        }
        /**如果是单个资源对象, 直接执行返回函数 */
        if (res[0] && res[0].url) {
            this.loader.load(res, loaded_callback, loading_callback);
            return;
        }
        /**传入的资源不是res[]格式 */
        if (!res[0].length || !res[0][0] || !res[0][0].url) {
            zutil.logErr('load:> res is not a res array');
            return;
        }

        let len = res.length;
        let loaded_item_num = 0;
        let loading_progress_callback = null;

        if (loading_callback) {
            loading_progress_callback = Laya.Handler.create(
                this,
                progress => {
                    loading_callback.runWith(
                        (loaded_item_num + progress) / len,
                    );
                },
                null,
                false,
            );
        }

        for (let i = len - 1; i >= 0; i--) {
            this.loadItem(
                res[i],
                Laya.Handler.create(this, () => {
                    loaded_item_num++;
                    if (loading_callback) {
                        loading_callback.runWith(loaded_item_num / len);
                    }

                    if (loaded_item_num == len) {
                        loaded_callback.runWith(loaded_callback.args);
                    }
                }),
                loading_progress_callback,
            );
        }
    }
    /** 停止正在队列加载 */
    private stopLoadQue() {
        let loader = this.loader;
        let loading_item = this.loading_item;
        /**如果正在加载的是load, 不停止, load具有最高的优先级 */
        if (this.life_status != 'inited') {
            return;
        }
        if (this.status != 'loading') {
            return;
        }
        this.status = 'stop';
        /**停止正在加载的资源*/

        loader.clearUnLoaded();
        // zutil.log('load_ctrl::clearUnLoaded::end', this.life_status, this.status); //debug
        if (!loading_item) {
            return;
        }
        /**将正在加载的资源重新放到加载队列的前面*/
        this.load_queue.unshift(loading_item);
    }
    /**添加ctrl资源进入加载队列*/
    private addCtrlToQueue(ctrl: NodeCtrl, callback?: Function) {
        let ctrl_res_info = this.getCtrlResInfo(ctrl);

        /**加载资源完成后设置resource_status= loaded, 将这个包裹在资源加载完成的执行函数中*/
        let new_callback = () => {
            ctrl.resource_status = 'loaded';
            if (isFunc(callback)) {
                callback();
            }
        };

        /**如果没有资源 也没有依赖资源 直接执行,
         * 这么做是防止 alert tip 弹层被初始化被延迟执行了
         * 这显然没有必要
         */
        if (
            !ctrl_res_info.res &&
            !(
                ctrl_res_info.res_dependencies &&
                ctrl_res_info.res_dependencies.length
            )
        ) {
            new_callback();
            return;
        }

        /**加载顺序 relative --> 自己 --> dep, loadqueue 是从前到后加载所有加载的顺序是 这样的*/
        /*relative res*/
        if (ctrl_res_info.res_relatives && ctrl_res_info.res_relatives.length) {
            /** 数组里面的按顺序加载比较合理, 为了保证这一步, 后面的要先加进去--load的逻辑是后加的先加载 */
            let len = ctrl_res_info.res_relatives.length;
            for (let i = len - 1; i >= 0; i--) {
                this.addResToQueue({
                    res: ctrl_res_info.res_relatives[i],
                    load_style: 'in_background',
                    ctrl_name: ctrl_res_info.ctrl_name,
                    type: 'relative',
                    order: 0,
                });
            }
        }

        let res: any[] = [];
        if (_.isArray(ctrl_res_info.res[0])) {
            res = res.concat(ctrl_res_info.res);
        } else {
            res.push(ctrl_res_info.res);
        }
        if (
            ctrl_res_info.res_dependencies &&
            ctrl_res_info.res_dependencies.length
        ) {
            res = res.concat(ctrl_res_info.res_dependencies);
        }

        /*自己 res*/
        this.addResToQueue({
            res: res,
            end_listener: new_callback,
            load_style: ctrl_res_info.load_style,
            is_scene: ctrl_res_info.is_scene,
            status: ctrl_res_info.status,
            ctrl_name: ctrl_res_info.ctrl_name,
            type: 'dependency',
            order: ctrl_res_info.order || 0,
        });
    }
    /**
     * 有需要加载资源的NodeCtrl, 通过name在resMap定位相应的资源,
     * 先加载资源再初始化ui,
     */
    private getCtrlResInfo(ctrl: NodeCtrl) {
        let res: any[],
            order: number,
            name: string,
            status: t_resource_status,
            res_dependencies: any[],
            res_relatives: any[],
            is_scene: boolean,
            load_style: t_load_style = 'in_background';
        let res_name = ctrl.res_name || ctrl.name;
        for (let i = 0; i < RESMAP.length; i++) {
            if (RESMAP[i].name == res_name) {
                res = RESMAP[i].res;
                name = RESMAP[i].name;
                order = RESMAP[i].order;
                status = RESMAP[i].resource_status as t_resource_status;
                res_relatives = RESMAP[i].res_relatives;
                res_dependencies = RESMAP[i].res_dependencies;
                is_scene = ctrl instanceof SceneCtrl && ctrl != this;
                if (RESMAP[i].load_style) {
                    load_style = RESMAP[i].load_style;
                }
            }
        }
        if (is_scene) {
            load_style = 'show_loading';
        }
        /**场景的优先级 大于没有order的 小于所有小鱼order的 */
        return {
            /**本身资源*/
            res: res,
            /**依赖资源--必须提前加载*/
            res_dependencies: res_dependencies,
            /**关联资源--后续加载*/
            res_relatives: res_relatives,
            status: status,
            load_style: load_style,
            is_scene: is_scene,
            ctrl_name: name,
            order: order || (is_scene ? 1 : 0),
        };
    }
    private addResToQueue(res_info: load_item) {
        let load_queue = this.load_queue;

        /**如果正在加载的元素的优先级小于等于 要加载元素优先级, 停止正在加载的队列*/
        let loading_item = this.loading_item;
        if (loading_item) {
            if (loading_item.order <= res_info.order) {
                this.stopLoadQue();
            }
        }

        /**
         * 只保证进入最后一个scene, 将所有的其他的scence 的加载完成执行函数全部冲掉
         */
        if (res_info.is_scene) {
            for (let len = load_queue.length, i = len - 1; i >= 0; i--) {
                if (!load_queue[i].is_scene) {
                    continue;
                }
                if (load_queue[i].order <= res_info.order) {
                    zutil.logErr(
                        `load:${res_info.ctrl_name}--${
                            load_queue[i].ctrl_name
                        }: end_listener close other`,
                    );
                    load_queue[i].end_listener = undefined;
                    load_queue[i].load_style = 'in_background';
                } else {
                    zutil.logErr(
                        `load:${res_info.ctrl_name}--${
                            load_queue[i].ctrl_name
                        }: end_listener close self`,
                    );
                    res_info.end_listener = undefined;
                    res_info.load_style = 'in_background';
                    break;
                }
            }
        }

        /**将要加载的元素按照他的order排列*/
        for (let i = 0; i < load_queue.length; i++) {
            if (load_queue[i].order <= res_info.order) {
                load_queue.splice(i, 0, res_info);
                return;
            }
        }
        /**如果为空直接push进去*/
        load_queue.push(res_info);
    }
    /**
     * 设置resMap中资源的状态
     */
    private setCtrlResStatus(ctrl: NodeCtrl, status: t_resource_status) {
        for (let i = 0; i < RESMAP.length; i++) {
            if (RESMAP[i].name == ctrl.name) {
                RESMAP[i].resource_status = status;
            }
        }
    }
    /**隐藏*/
    public show(callback?: Function) {
        let bg_ani = this.link.bg_ani;
        let view = this.view;
        if (!this.view) {
            return;
        }
        if (this.is_showing) {
            if (isFunc(callback)) {
                callback();
            }
            return;
        }

        this.reset();

        this.link.progress_bar.value = 0;
        this.showing_timestamp = new Date().getTime();
        this.is_showing = true;
        bg_ani.resume();
        if (isFunc(callback)) {
            callback();
        }
        animate.fade_in(view, 400);
        super.show();
    }
    /**隐藏*/
    public hide(callback?: Function) {
        let bg_ani = this.link.bg_ani;
        let view = this.view;
        this.is_showing = false;

        let hide_fn = () => {
            animate.fade_out(view, 400, () => {
                bg_ani.paused();
                callFunc(callback);
            });
        };

        /**最小显示时间 如果显示的时间已经大于load_show_min_time 直接执行, 不然等待吧最小显示时间然后隐藏*/
        let show_time = new Date().getTime() - this.showing_timestamp;

        if (show_time > CONFIG.load_show_min_time * 1000) {
            hide_fn();
            return;
        }
        window.clearTimeout(this.hide_time_out);
        this.hide_time_out = window.setTimeout(function() {
            hide_fn();
        }, CONFIG.load_show_min_time * 1000 - show_time);
    }
    private toggleCover(callback?: Function) {
        this.reset();

        let view = this.view;
        let cover = this.link.cover;
        let con = this.link.con;
        let cover_anis = this.link.cover_anis;
        for (let i = 0; i < cover_anis.length; i++) {
            cover_anis[i].resume();
        }

        this.is_showing = false;
        cover.visible = true;
        con.visible = false;
        this.showing_timestamp = new Date().getTime();
        /**显示load_cover之后, 执行函数*/
        animate.fade_in(view, 400, () => {
            if (isFunc(callback)) {
                callback();
            }
        });

        /**总共显示一秒钟*/
        this.hide(() => {
            cover.visible = false;
            con.visible = true;
            for (let i = 0; i < cover_anis.length; i++) {
                cover_anis[i].paused();
            }
        });
    }
    /**loading完成*/
    private onLoaded(callback?: Function) {
        callFunc(callback);
        this.hide(() => {
            this.reset();
        });
    }
    /**显示加载进度条*/
    private showLoadingProgress(percent: number) {
        /** 在loadCtrl还没有初始化的时候不执行下面*/
        if (!this.view) {
            return true;
        }
        this.link.progress_bar.value = percent;
    }
    /**重置*/
    private reset() {
        window.clearTimeout(this.hide_time_out);
        window.clearTimeout(this.hide_cover_timeout);
    }
}
