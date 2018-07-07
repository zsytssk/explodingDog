import {
    Change_Item,
    compareObj,
    routerObjToUrl,
    routerUrlToObj,
} from './zsy.director.utils';
import { log } from './zutil';

type UrlInfo = {
    path?: string;
    outset?: {
        [key: string]: string;
    };
    param?: {
        [key: string]: string;
    };
};
export type Director_Change_Info = {
    type: UrlChangeType;
    key?: string;
    ori_val?: string;
    end_val?: string;
};

export type ChangeListener = (data: Director_Change_Info) => void;

export type set_path_info = {
    type: UrlChangeType;
    /** outset改变的name */
    outset_name?: string;
    /** outset改变的key name */
    param_name?: string;
    value: any;
};
/**  路径变化的类型  */
export type UrlChangeType = 'path' | 'outset' | 'param';

export type DirectorType = 'history' | 'hash' | 'memory';

/**  路由控制  */
export class ZsyDirector {
    private mode: DirectorType;
    private root;
    private interval = null;
    private on_change_before_fns = [] as ChangeListener[];
    /** 当前页面所在的地址 */
    private cur_router: UrlInfo = {
        outset: undefined,
        param: undefined,
    };
    constructor(options) {
        this.initConfig(options);
    }
    private initConfig(options) {
        this.mode = (options && options.mode) || 'hash';

        if (this.mode === 'history' && !history.pushState) {
            this.mode = 'hash';
        }

        this.root =
            options && options.root
                ? '/' + this.clearPath(options.root) + '/'
                : '/';
        return this;
    }
    /**  获得当前的页面地址  */
    public getUrl() {
        let path = '';
        if (this.mode !== 'memory') {
            const match = window.location.href.match(/#(.*)$/);
            path = match ? match[1] : '';
        } else {
            path = localStorage.getItem('zsy_director_url') || '';
        }

        path = this.clearPath(path);

        return routerUrlToObj(path);
    }
    private clearPath(path) {
        return path.toString().replace(/\/{2,}/g, '/');
    }
    private getFullPath(path) {
        return location.href
            .replace(location.origin, '')
            .replace(location.pathname, path);
    }
    public listen() {
        if (this.mode === 'history') {
            window.addEventListener('popstate', e => {
                this.check();
            });
        } else {
            clearInterval(this.interval);
            this.interval = window.setInterval(this.check.bind(this), 100);
        }
        this.check();
        return;
    }
    private check() {
        const cur_url_info = this.getUrl();
        const current = this.cur_router;

        const change_arr = compareObj(current, cur_url_info);
        /** 没有改变  */
        if (!change_arr.length) {
            return;
        }

        const fn_len = this.on_change_before_fns.length;

        this.on_change_before_fns.forEach((fun, i) => {
            if (!fun && typeof fun !== 'function') {
                return true;
            }
            for (const change of change_arr) {
                window.setTimeout(() => {
                    this.runChangeFun(fun, change);
                }, 0);
            }
            if (i === fn_len - 1) {
                this.cur_router = cur_url_info;
            }
        });
        return;
    }
    private runChangeFun(fun: ChangeListener, change_item: Change_Item) {
        let change_info = {} as Director_Change_Info;
        if (change_item.key === 'path') {
            change_info = {
                type: 'path',
                ori_val: change_item.ori_val,
                end_val: change_item.end_val,
            };
        }
        if (change_item.key.indexOf('outset') !== -1) {
            change_info = {
                type: 'outset',
                key: change_item.key.replace(/outset(:)*/g, ''),
                ori_val: change_item.ori_val,
                end_val: change_item.end_val,
            };
        }
        if (change_item.key.indexOf('param') !== -1) {
            change_info = {
                type: 'param',
                key: change_item.key.replace(/param(:)*/g, ''),
                ori_val: change_item.ori_val,
                end_val: change_item.end_val,
            };
        }
        fun(change_info);
    }
    public onChangeBefore(fun: ChangeListener) {
        if (!fun || typeof fun !== 'function') {
            return;
        }
        this.on_change_before_fns.push(fun);
    }
    /** 设置当前的页面地址
     * @param replace_state  是否覆盖前一个历史
     * 地址没有意义 跳入default, 这时候 前一个地址还在历史中,
     * 点击后退 还是进入default 原页面
     */
    public navigate(path_info: set_path_info, replace_state: boolean) {
        const type = path_info.type;
        const url_info = this.getUrl();

        switch (type) {
            case 'path':
                url_info.path = path_info.value;
                break;
            case 'outset':
                const outset_name = path_info.outset_name;
                if (outset_name) {
                    url_info.outset = url_info.outset || {};
                    url_info.outset[outset_name] = path_info.value;
                } else {
                    url_info.outset = path_info.value;
                }
                break;
            case 'param':
                const param_name = path_info.param_name;
                if (param_name) {
                    url_info.param = url_info.param || {};
                    url_info.param[param_name] = path_info.value;
                } else {
                    url_info.param = path_info.value;
                }
                break;
            default:
                break;
        }

        let router_str = routerObjToUrl(url_info);
        router_str = this.clearPath('#/' + router_str);

        switch (this.mode) {
            case 'history':
                const base_url =
                    location.pathname +
                    location.search +
                    this.clearPath(router_str);
                /** 如果是 默认跳转说明前一个地址没有意义直接覆盖 前一个历史 */
                log('history_change', base_url);
                if (replace_state) {
                    history.replaceState(null, null, base_url);
                } else {
                    history.pushState(null, null, base_url);
                }
                this.check();
                break;
            case 'hash':
                window.location.href =
                    window.location.href.replace(/#(.*)$/, '') + router_str;
                break;
            case 'memory':
                localStorage.setItem('zsy_director_url', router_str);
                break;
        }
    }
}
