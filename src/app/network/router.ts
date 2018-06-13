import { delArrSameItem, splitPath } from '../../utils/tool';
import {
    Director_Change_Info,
    set_path_info,
    ZsyDirector,
} from '../../utils/zsy.director';
import {
    getChildrenByType,
    getElementsByType,
    log,
    logErr,
    queryClosest,
} from '../../utils/zutil';
import { AppCtrl, cmd as app_cmd } from '../app';
import { BaseCtrl } from '../component/base';
import { RouterOutsetCtrl } from '../component/routerOutset';

export const cmd = {
    /** router 初始化 */
    init: 'router::init',
    /** router change */
    change: 'router::change',
    /** 路由离开页面 */
    leave: 'router::leave',
    /** 路由进入页面 */
    enter: 'router::enter',
};

/** router切换传给CMD.router_enter的数据结构  */
export type RouterEnterData = {
    router_path: string;
    is_completed: boolean;
};
/** 变化  */
export type RouterChangeData = {
    cur_page: string;
    next_page: boolean;
};
/** 初始化  */
export type RouterInitData = {
    page: string;
};

export type RouterConfig = Array<{
    children?: RouterConfig;
    ctrl?: typeof BaseCtrl;
    outset?: string;
    path: string;
    redirectTo?: string;
}>;

interface Link {
    app: AppCtrl;
}
/** 路由控制器 */
export class RouterCtrl extends BaseCtrl {
    protected link = {} as Link;
    /** director 用来设置 url, 同时监听url发生变化触发事件 */
    public director: ZsyDirector;
    public is_entered = false;
    public name = 'router';
    private config_node: RouterConfigNode;
    /** 路由控制器 */
    constructor() {
        super();
    }
    public init() {
        this.initLink();
        this.initDirector();
        this.initEvent();
    }
    private initLink() {
        this.link.app = queryClosest(this as BaseCtrl, 'name:app') as AppCtrl;
    }
    /** 初始化router */
    private initDirector() {
        const options = {
            mode: 'memory',
        };
        this.director = new ZsyDirector(options);
        this.director.onChangeBefore(this.onRouterChange.bind(this));
    }
    private initEvent() {
        // app 初始化之后初始化
        this.on(app_cmd.initialized, () => {
            this.director.listen();
        });
    }
    /** 添加顶级config  */
    public forRoot(config: RouterConfig) {
        const app = this.link.app;
        const root_config_node = new RouterConfigNode({
            path: '/',
        });
        this.config_node = root_config_node;
        root_config_node.createChildByConfig(config);
        root_config_node.instance_ctrl = app;

        return {
            destroy: root_config_node.destroy,
        };
    }
    /** 添加次级config  */
    public forChild(config, path) {
        const root_config_node = this.config_node;

        const path_config_node = root_config_node.findChildNodeByPath(
            splitPath(path),
        );
        path_config_node.createChildByConfig(config);

        return {
            destroy: path_config_node.removeChildren,
        };
    }
    private onRouterChange(change_info: Director_Change_Info) {
        /** 主路径的修改  */
        if (change_info.type === 'path') {
            this.handlePathChange(change_info.ori_val, change_info.end_val);
            return;
        }
        /** 其他路径的修改  */
        if (change_info.type === 'outset') {
            this.handleOutsetChange(
                change_info.key,
                change_info.ori_val,
                change_info.end_val,
            );
            return;
        }
        /** 参数的修改  */
        if (change_info.type === 'param') {
            return;
        }
    }
    /**
     * 路由主路劲的变化的时候 处理相应的页面逻辑
     * @param prev_path 上一个路径地址
     * @param next_path 下一个(将要的变化)路径地址
     */
    private async handlePathChange(prev_path, next_path) {
        this.trigger(cmd.change, {
            next_path,
            prev_path,
        });

        const change_tree_arr = this.getChangeCtrlTree(prev_path, next_path);
        if (!change_tree_arr) {
            return;
        }
        const prev_ctrl_tree = change_tree_arr[0];
        const next_ctrl_tree = change_tree_arr[1];

        if (!next_ctrl_tree) {
            this.navigate('default', true);
        }

        if (prev_ctrl_tree && prev_ctrl_tree.length) {
            this.is_entered = false;
            await this.leaveNodePath(prev_ctrl_tree);
        }
        if (next_ctrl_tree && next_ctrl_tree.length) {
            await this.enterNodePath(next_ctrl_tree);
        }
    }
    /** router 一个个的进入...  */
    private async enterNodePath(config_node_arr: RouterConfigNode[]) {
        for (let i = 0; i < config_node_arr.length; i++) {
            const config_node = config_node_arr[i];
            if (!(config_node instanceof RouterConfigNode)) {
                logErr(`config node not exist`);
                return;
            }

            const redirect_node = config_node.redirect_node;
            if (redirect_node) {
                const redirect_path = redirect_node.abs_path;
                this.navigate(redirect_path, true);
                return;
            }

            const wrap_ctrl = config_node.parent.instance_ctrl;
            if (!wrap_ctrl) {
                logErr(`wrap_ctrl don't exist`);
            }
            const ctrl_create = config_node.ctrl;
            let ctrl = getElementsByType(wrap_ctrl, ctrl_create)[0] as any;
            if (!ctrl) {
                const router_outset = getChildrenByType(
                    wrap_ctrl,
                    RouterOutsetCtrl,
                )[0] as RouterOutsetCtrl;
                ctrl = new ctrl_create() as any;
                router_outset.addChild(ctrl);
            }

            config_node.instance_ctrl = ctrl;

            if (!ctrl.enter) {
                logErr(`${ctrl.name} has no enter function`);
                return;
            }
            await ctrl.enter();
            if (i >= config_node_arr.length - 1) {
                this.is_entered = true;
            }

            this.trigger(cmd.enter, {
                router_path: config_node.abs_path,
                is_completed: config_node_arr.length ? false : true,
            });
        }
    }
    /** 离开  */
    private async leaveNodePath(config_node_arr: RouterConfigNode[]) {
        if (!config_node_arr.length) {
            return;
        }
        for (const config_node of config_node_arr.reverse()) {
            if (!(config_node instanceof RouterConfigNode)) {
                logErr(`config node not exist`);
                return;
            }

            const ctrl = config_node.instance_ctrl as any;
            if (!ctrl) {
                log(`has no instance ctrl`);
                continue;
            }
            if (!ctrl.leave) {
                log(`${ctrl.name} has no leave function`);
                continue;
            }
            config_node.instance_ctrl = null;
            await ctrl.leave();

            this.trigger(cmd.leave, {
                router_path: config_node.abs_path,
                is_completed: config_node_arr.length ? false : true,
            });
        }
    }
    /**通过地址的变化得出变化的ctrl
     * @param prev_path 以前的地址
     * @param next_path 后面的地址
     * @param config_node 顶级的RouterConfigNode
     */
    private getChangeCtrlTree(
        prev_path,
        next_path,
        config_node?: RouterConfigNode,
    ): RouterConfigNode[][] {
        config_node = config_node || this.config_node;
        const prev_path_map = prev_path ? splitPath(prev_path) : [''];
        const next_path_map = next_path ? splitPath(next_path) : [''];
        next_path = next_path || '';

        /** 如果有redirect_to直接跳转  */
        const next_config_node = config_node.findChildNodeByPath(next_path_map);
        const prev_config_node = config_node.findChildNodeByPath(prev_path_map);
        const before_node_tree = prev_config_node
            ? prev_config_node.getAbsNode()
            : [];

        /** 如果不存在 next_config_node 说明地址没有相应的ctrl */
        if (!next_config_node) {
            return [before_node_tree];
        }

        const next_node_tree = next_config_node.getAbsNode();

        return delArrSameItem(before_node_tree, next_node_tree);
    }
    /**
     * 路由outset的变化的时候 处理相应的页面逻辑
     * @param outset_type outset 的名称
     * @param prev_path 上一个路径地址
     * @param next_path 下一个(将要的变化)路径地址
     */
    private handleOutsetChange(outset_type, prev_path, next_path) {
        const outset_config_node = this.getOutsetNode(outset_type);
        if (!outset_config_node) {
            logErr(`outset:${outset_type} don't exit`);
        }

        const change_tree_arr = this.getChangeCtrlTree(
            prev_path,
            next_path,
            outset_config_node,
        );
        if (!change_tree_arr) {
            return;
        }
        const prev_ctrl_tree = change_tree_arr[0];
        const next_ctrl_tree = change_tree_arr[1];

        if (prev_ctrl_tree && prev_ctrl_tree.length) {
            this.is_entered = false;
            this.leaveNodePath(prev_ctrl_tree);
        }
        if (next_ctrl_tree && next_ctrl_tree.length) {
            this.enterNodePath(next_ctrl_tree);
        }
    }
    /**
     * 路由outset的变化的时候 处理相应的页面逻辑
     * @param outset_type outset 的名称
     */
    private getOutsetNode(outset_type) {
        const root_config_node = this.config_node;
        return root_config_node.findChildNodeByPath([`[${outset_type}]`]);
    }
    /**
     * 跳转
     * @param path 要跳转的路径或者对象信息
     * @param replace_state 是否覆盖前一个历史
     */
    public navigate(path: string | set_path_info, replace_state?: boolean) {
        /** 只有字符串, 路径修改  */
        if (typeof path === 'string') {
            this.director.navigate(
                {
                    type: 'path',
                    value: path,
                },
                replace_state,
            );
            return;
        }

        this.director.navigate(path, replace_state);
    }
}

type CreateRouterConfig = {
    redirect_to?: string;
    ctrl?: typeof BaseCtrl;
    path?: string;
    outset?: string;
};

/** 路由配置node节点
 * 整个 router 的配置都是一个个的 RouterConfigNode 节点, 这样我可以随时添加删除
 * 一个配置做成这个样子是应该很浪费的, 我目前没有想到更好的方法去组织
 */
class RouterConfigNode {
    public ctrl: typeof BaseCtrl;
    public instance_ctrl: BaseCtrl;
    private path: string;
    private children = [] as RouterConfigNode[];
    public parent: RouterConfigNode;
    private outset: string;
    private redirect_to: string;
    constructor(config: CreateRouterConfig) {
        this.ctrl = config.ctrl;
        this.path = config.path;
        this.outset = config.outset;
        this.redirect_to = config.redirect_to;
    }
    public get is_top() {
        return this.parent ? false : true;
    }
    public get abs_path() {
        if (!this.path) {
            return;
        }
        if (this.parent.is_top) {
            return '/' + this.path;
        }
        return this.parent.abs_path + '/' + this.path;
    }
    public getAbsNode(): RouterConfigNode[] {
        if (!this.parent) {
            return [];
        }
        return this.parent.getAbsNode().concat([this]);
    }
    /** 找到当前  */
    public get redirect_node(): RouterConfigNode {
        if (!this.redirect_to) {
            return;
        }
        if (!this.parent) {
            return;
        }
        const path_arr = splitPath(this.redirect_to);
        let wrap_node = this.parent;
        while (true) {
            if (path_arr[0] === '..') {
                path_arr.shift();
                if (wrap_node.parent) {
                    logErr(`${wrap_node.abs_path} has not parent!`);
                    return;
                }
                wrap_node = wrap_node.parent;
                continue;
            }
            break;
        }
        return wrap_node.findChildNodeByPath(path_arr);
    }
    /**  添加childNode  */
    public addChild(childNode: RouterConfigNode) {
        const children = this.children;
        children.push(childNode);
        childNode.parent = this;
    }
    /**  删除childNode  */
    public removeChild(childNode: RouterConfigNode) {
        const child_index = this.children.indexOf(childNode);
        if (child_index === -1) {
            return;
        }
        this.children.splice(child_index, 1);
    }
    public removeChildren() {
        for (let len = this.children.length, i = len - 1; i >= 0; i--) {
            this.children[i].destroy();
        }
        this.children = [];
    }
    public findChildNodeByPath(path_map: string[]): RouterConfigNode {
        if (path_map.length === 0) {
            return this;
        }

        const cur_path = path_map.shift();
        const children = this.children;
        for (const child of children) {
            if (child.path === cur_path) {
                return child.findChildNodeByPath(path_map);
            }
        }
        return null;
    }
    public createChildByConfig(config: RouterConfig) {
        for (const config_item of config) {
            const config_node = new RouterConfigNode({
                path: config_item.path,
                redirect_to: config_item.redirectTo,
                ctrl: config_item.ctrl,
                outset: config_item.outset,
            });
            if (config_item.children) {
                config_node.createChildByConfig(config_item.children);
            }

            this.addChild(config_node);
        }
    }
    public destroy() {
        // 删除所有的子类
        this.removeChildren();
        if (this.parent) {
            this.parent.removeChild(this);
            this.parent = null;
        }
    }
}
