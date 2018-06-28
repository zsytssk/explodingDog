import * as isArray from 'lodash/isArray';
import { callFunc } from './tool';
import { log, logErr } from './zutil';

/** 加载队列 */
type load_item = {
    res?: any[];
    /** 所属的ctrl名称 */
    res_name?: string;
    type: 'dependency' | 'relative';
    status?: t_resource_status;
    resolve?: FuncVoid;
    reject?: FuncVoid;
    loading_fun?: FunLoading;
    order: number;
};

type FunLoading = (process: number) => void;

/** loading的状态 空闲 正在加载 */
type t_load_status = 'stop' | 'loading';
class LoadUtil {
    private load_queue: load_item[] = [];
    private status: t_load_status = 'stop';
    private loader = Laya.loader;
    /** 正在加载的资源 */
    private loading_item: load_item;
    private res_map: ResMap;
    /** 设置资源列表 */
    public setResmap(res_map: ResMap) {
        this.res_map = res_map;
    }
    /**
     * 加载资源之后执行返回函数
     * @param ctrl 需要加载资源的控制器
     * @param callback 返回函数
     */
    public load(res_name: string, loading_fun?: FunLoading) {
        // zutil.log('load_ctrl::load', ctrl.name);

        /**  将资源添加到load_que中  */
        const promise = this.addCtrlToQueue(res_name, loading_fun);
        /** 如果load没有正在加载的资源, 启动记载 */
        if (this.status === 'stop') {
            this.status = 'loading';
            this.loadingQueue();
        }
        return promise;
    }
    /**
     * 加依赖资源
     */
    private loadingQueue() {
        const load_queue = this.load_queue;
        if (load_queue.length === 0) {
            this.status = 'stop';
            log('load_queue is empty, all res is loaded');
            return;
        }

        this.loading_item = load_queue.shift();
        const { res, loading_fun, status } = this.loading_item;
        const resolve = this.loading_item.resolve;

        const loading_item = this.loading_item;
        // if (loading_item.type != 'relative') {  //debug
        // zutil.log('load_ctrl::loading_item', loading_item.ctrl_name, loading_item);
        // }
        const new_resolve = () => {
            // if (loading_item.type != 'relative') {  //debug
            // zutil.log('load_ctrl::loaded_item', loading_item.ctrl_name, loading_item);
            // }
            /**loader.clearUnLoaded 有时并不能停止正在加载的资源
             * 导致多个加载队列同时进行, 会导致我的load过程中黑屏bug
             * 如果当前加载结束的元素和正在加载的元素和不一样,
             * 说明在插入加载资源的时候stopLoadQue并没有停止,
             * 所以这里的所有操作并不需要去进行
             */
            if (this.loading_item !== loading_item) {
                return;
            }
            this.loading_item = null;

            callFunc(resolve);
            this.loadingQueue();
        };

        /** 如果资源已经加载 | 没有资源 | 资源为空 直接调用callback */
        if (!res || res.length === 0 || status === 'loaded') {
            new_resolve();
            return;
        }

        /** 加载完成执行函数 */
        const loaded_callback: Laya.Handler = Laya.Handler.create(
            this,
            new_resolve,
        );

        /** 正在加载函数 */
        let loading_callback: Laya.Handler = null;
        if (loading_fun) {
            loading_callback = Laya.Handler.create(
                this,
                loading_fun,
                null,
                false,
            );
        }

        this.loadItem(res, loaded_callback, loading_callback);
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
        /** 空的资源列表 直接执行返回函数  */
        if (!res.length) {
            loaded_callback.run();
            return;
        }
        /** 如果是单个资源对象, 直接执行返回函数  */
        if (res[0] && res[0].url) {
            Laya.loader.load(res, loaded_callback, loading_callback);
            return;
        }
        /** 传入的资源不是res[]格式  */
        if (!res[0].length || !res[0][0] || !res[0][0].url) {
            logErr('load:> res is not a res array');
            return;
        }

        const len = res.length;
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

                    if (loaded_item_num === len) {
                        loaded_callback.runWith(loaded_callback.args);
                    }
                }),
                loading_progress_callback,
            );
        }
    }
    /**  停止正在队列加载  */
    private stopLoadQue() {
        const loader = Laya.loader;
        const loading_item = this.loading_item;
        // /** 如果正在加载的是load, 不停止, load具有最高的优先级  */
        // if (this.life_status != 'inited') {
        //     return;
        // }
        if (this.status !== 'loading') {
            return;
        }
        this.status = 'stop';
        /** 停止正在加载的资源 */

        loader.clearUnLoaded();
        // zutil.log('load_ctrl::clearUnLoaded::end', this.life_status, this.status); //debug
        if (!loading_item) {
            return;
        }
        /** 将正在加载的资源重新放到加载队列的前面 */
        this.load_queue.unshift(loading_item);
    }
    /** 添加ctrl资源进入加载队列 */
    private addCtrlToQueue(res_name: string, loading_fun?: FunLoading) {
        return new Promise((resolve, reject) => {
            const res_info = this.getResInfo(res_name);

            /** 加载资源完成后设置resource_status= loaded, 将这个包裹在资源加载完成的执行函数中 */
            const end_resolve = () => {
                this.setResStatus(res_name, 'loaded');
                resolve();
            };

            /**如果没有资源 也没有依赖资源 直接执行,
             * 这么做是防止 alert tip 弹层被初始化被延迟执行了
             * 这显然没有必要
             */
            if (
                !res_info.res &&
                !(res_info.res_dependencies && res_info.res_dependencies.length)
            ) {
                end_resolve();
                return;
            }

            /** 加载顺序 relative --> 自己 --> dep, loadqueue 是从前到后加载所有加载的顺序是 这样的 */
            /*relative res*/
            if (res_info.res_relatives && res_info.res_relatives.length) {
                /**  数组里面的按顺序加载比较合理, 为了保证这一步, 后面的要先加进去--load的逻辑是后加的先加载  */
                const len = res_info.res_relatives.length;
                for (let i = len - 1; i >= 0; i--) {
                    this.addResToQueue({
                        order: 0,
                        res: res_info.res_relatives[i],
                        res_name,
                        type: 'relative',
                    });
                }
            }

            let res: any[] = [];
            if (isArray(res_info.res[0])) {
                res = res.concat(res_info.res);
            } else {
                res.push(res_info.res);
            }
            if (res_info.res_dependencies && res_info.res_dependencies.length) {
                res = res.concat(res_info.res_dependencies);
            }

            /*自己 res*/
            this.addResToQueue({
                loading_fun,
                order: res_info.order || 0,
                reject,
                res,
                res_name,
                resolve: end_resolve,
                status: res_info.status,
                type: 'dependency',
            });
        });
    }
    /**
     * 有需要加载资源的NodeCtrl, 通过name在resMap定位相应的资源,
     * 先加载资源再初始化ui,
     */
    private getResInfo(res_name: string) {
        let res: any[];
        let order: number;
        let name: string;
        let status: t_resource_status;
        let res_dependencies: any[];
        let res_relatives: any[];

        for (const item of this.res_map) {
            if (item.name === res_name) {
                res = item.res;
                name = item.name;
                order = item.order;
                status = item.resource_status as t_resource_status;
                res_relatives = item.res_relatives;
                res_dependencies = item.res_dependencies;
            }
        }
        /** 场景的优先级 大于没有order的 小于所有小鱼order的  */
        return {
            order: order || 0,
            /** 本身资源 */
            res,
            /** 依赖资源--必须提前加载 */
            res_dependencies,
            /** 关联资源--后续加载 */
            res_relatives,
            status,
        };
    }
    private addResToQueue(res_info: load_item) {
        const load_queue = this.load_queue;

        /** 如果正在加载的元素的优先级小于等于 要加载元素优先级, 停止正在加载的队列 */
        const loading_item = this.loading_item;
        if (loading_item) {
            if (loading_item.order <= res_info.order) {
                this.stopLoadQue();
            }
        }

        /** 将要加载的元素按照他的order排列 */
        for (let i = 0; i < load_queue.length; i++) {
            if (load_queue[i].order <= res_info.order) {
                load_queue.splice(i, 0, res_info);
                return;
            }
        }
        /** 如果为空直接push进去 */
        load_queue.push(res_info);
    }
    /**
     * 设置resMap中资源的状态
     */
    private setResStatus(res_name: string, status: t_resource_status) {
        for (const item of this.res_map) {
            if (item.name === name) {
                item.resource_status = status;
            }
        }
    }
}

export const load_util = new LoadUtil();
