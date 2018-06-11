import { CMD } from '../../data/cmd';
import { delArrSameItem, splitPath } from '../../utils/other';
import {
    Director_Change_Info,
    set_path_info,
    zsyDirector,
} from '../../utils/zsy.director';
import {
    getChildrenByType,
    log,
    logErr,
    queryClosest,
} from '../../utils/zutil';
import { AppCtrl } from '../app';
import { BaseCtrl } from '../component/base';
import { RouterOutsetCtrl } from '../component/routerOutset';

/**router切换传给CMD.router_enter的数据结构 */
export type t_router_enter_data = {
    router_path: string;
    is_completed: boolean;
};
/**变化 */
type t_router_enter_change = {
    cur_page: string;
    next_page: boolean;
};
/**初始化 */
export type t_router_enter_init = {
    enter_page: string;
};

export type RouterConfig = {
    path: string;
    ctrl?: typeof BaseCtrl;
    outset?: string;
    redirectTo?: string;
    children?: RouterConfig;
}[];

interface i_routerctrl_link {
    app: AppCtrl;
}
/**路由控制器*/
export class RouterCtrl extends BaseCtrl {
    protected link: i_routerctrl_link = {} as i_routerctrl_link;
    /**director用来设置url, 同时监听url发生变化触发事件*/
    public director: zsyDirector;
    public is_entered = false;
    public name = 'router';
    private config_node: RouterConfigNode;
    /**路由控制器*/
    constructor() {
        super();
    }
    init() {
        this.initLink();
        this.initDirector();
        this.initEvent();
    }
    private initLink() {
        this.link.app = queryClosest(<BaseCtrl>this, 'name:app') as AppCtrl;
    }
    /**初始化router*/
    private initDirector() {
        let options = {
            // mode: detectModel('autoTest') ? 'hash' : 'history'
            // mode: 'hash'
            mode: 'history',
        };
        this.director = new zsyDirector(options);
        this.director.onChangeBefore(this.onRouterChange.bind(this));
    }
    private initEvent() {
        // app 初始化之后初始化
        this.on(CMD.app_inited, () => {
            this.director.listen();
        });
    }
    /**添加顶级config */
    public forRoot(config: RouterConfig) {
        let app = this.link.app;
        let path = '/';
        let root_config_node = new RouterConfigNode({
            path: '/',
        });
        this.config_node = root_config_node;
        root_config_node.createChildByConfig(config);
        root_config_node.instance_ctrl = app;

        return {
            destroy: root_config_node.destroy,
        };
    }
    /**添加次级config */
    public forChild(config, path) {
        let root_config_node = this.config_node;

        let path_config_node = root_config_node.findChildNodeByPath(
            splitPath(path),
        );
        path_config_node.createChildByConfig(config);

        return {
            destroy: path_config_node.removeChildren,
        };
    }
    private onRouterChange(change_info: Director_Change_Info) {
        /**主路径的修改 */
        if (change_info.type == 'path') {
            this.handlePathChange(change_info.ori_val, change_info.end_val);
            return;
        }
        /**其他路径的修改 */
        if (change_info.type == 'outset') {
            this.handleOutsetChange(
                change_info.key,
                change_info.ori_val,
                change_info.end_val,
            );
            return;
        }
        /**参数的修改 */
        if (change_info.type == 'param') {
            return;
        }
    }
    /**
     * 路由主路劲的变化的时候 处理相应的页面逻辑
     * @param prev_path 上一个路径地址
     * @param next_path 下一个(将要的变化)路径地址
     */
    private handlePathChange(prev_path, next_path) {
        this.trigger(CMD.router_change, {
            prev_path: prev_path,
            next_path: next_path,
        });

        let change_tree_arr = this.getChangeCtrlTree(prev_path, next_path);
        if (!change_tree_arr) {
            return;
        }
        let prev_ctrl_tree = change_tree_arr[0];
        let next_ctrl_tree = change_tree_arr[1];

        if (!next_ctrl_tree) {
            this.navigate('default', true);
        }

        if (prev_ctrl_tree && prev_ctrl_tree.length) {
            this.is_entered = false;
            this.leaveNodePath(prev_ctrl_tree);
        }
        if (next_ctrl_tree && next_ctrl_tree.length) {
            this.enterNodePath(next_ctrl_tree);
        }
    }
    private enterNodePath(config_node_arr: RouterConfigNode[]) {
        if (!config_node_arr.length) {
            return;
        }

        let cur_config_node = config_node_arr.shift();
        if (!(cur_config_node instanceof RouterConfigNode)) {
            logErr(`config node not exist`);
            return;
        }

        let redirect_node = cur_config_node.redirect_node;
        if (redirect_node) {
            let redirect_path = redirect_node.abs_path;
            this.navigate(redirect_path, true);
            return;
        }

        let wrap_ctrl = cur_config_node.parent.instance_ctrl;
        if (!wrap_ctrl) {
            logErr(`wrap_ctrl don't exist`);
        }
        let ctrl_create = cur_config_node.ctrl;
        let ctrl = getElementsByType(wrap_ctrl, ctrl_create)[0] as any;
        if (!ctrl) {
            let router_outset = getChildrenByType(
                wrap_ctrl,
                RouterOutsetCtrl,
            )[0] as RouterOutsetCtrl;
            ctrl = new ctrl_create() as any;
            router_outset.addChild(ctrl);
        }

        cur_config_node.instance_ctrl = ctrl;

        let enter_fn = ctrl.enter;
        if (!enter_fn) {
            logErr(`${ctrl.name} has no enter function`);
            return;
        }

        enter_fn.bind(ctrl)(() => {
            if (!config_node_arr.length) {
                this.is_entered = true;
            }

            this.enterNodePath(config_node_arr);
            this.trigger(CMD.router_enter, {
                router_path: cur_config_node.abs_path,
                is_completed: config_node_arr.length ? false : true,
            });
        });
    }
    /**离开 */
    private leaveNodePath(config_node_arr: RouterConfigNode[]) {
        if (!config_node_arr.length) {
            return;
        }

        let cur_config_node = config_node_arr.pop();
        if (!(cur_config_node instanceof RouterConfigNode)) {
            logErr(`config node not exist`);
            return;
        }

        let ctrl = cur_config_node.instance_ctrl as any;
        if (!ctrl) {
            this.leaveNodePath(config_node_arr);
            log(`has no instance ctrl`);
            return;
        }
        let level_fn = ctrl.leave;
        if (!level_fn) {
            this.leaveNodePath(config_node_arr);
            log(`${ctrl.name} has no leave function`);
            return;
        }
        cur_config_node.instance_ctrl = null;
        level_fn.bind(ctrl)(() => {
            this.trigger(CMD.router_leave, {
                router_path: cur_config_node.abs_path,
                is_completed: config_node_arr.length ? false : true,
            });

            this.leaveNodePath(config_node_arr);
        });
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
        let prev_path_map = prev_path ? splitPath(prev_path) : [''];
        let next_path_map = next_path ? splitPath(next_path) : [''];
        next_path = next_path || '';

        /**如果有redirect_to直接跳转 */
        let next_config_node = config_node.findChildNodeByPath(next_path_map);
        let prev_config_node = config_node.findChildNodeByPath(prev_path_map);
        let before_node_tree = prev_config_node
            ? prev_config_node.getAbsNode()
            : [];

        /**如果不存在 next_config_node 说明地址没有相应的ctrl*/
        if (!next_config_node) {
            return [before_node_tree];
        }

        let next_node_tree = next_config_node.getAbsNode();

        return delArrSameItem(before_node_tree, next_node_tree);
    }
    /**
     * 路由outset的变化的时候 处理相应的页面逻辑
     * @param outset_type outset 的名称
     * @param prev_path 上一个路径地址
     * @param next_path 下一个(将要的变化)路径地址
     */
    private handleOutsetChange(outset_type, prev_path, next_path) {
        let outset_config_node = this.getOutsetNode(outset_type);
        if (!outset_config_node) {
            logErr(`outset:${outset_type} don't exit`);
        }

        let change_tree_arr = this.getChangeCtrlTree(
            prev_path,
            next_path,
            outset_config_node,
        );
        if (!change_tree_arr) {
            return;
        }
        let prev_ctrl_tree = change_tree_arr[0];
        let next_ctrl_tree = change_tree_arr[1];

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
        let root_config_node = this.config_node;
        return root_config_node.findChildNodeByPath([`[${outset_type}]`]);
    }
    /**
     * 跳转
     * @param path 要跳转的路径或者对象信息
     * @param replace_state 是否覆盖前一个历史
     */
    public navigate(path: string | set_path_info, replace_state?: boolean) {
        /**只有字符串, 路径修改 */
        if (typeof path == 'string') {
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
/**路由配置node节点
 * 整个router的配置都是一个个的RouterConfigNode节点, 这样我可以随时添加删除
 * 一个配置做成这个样子是应该很浪费的, 我目前没有想到更好的方法去组织
 */
class RouterConfigNode {
    ctrl: typeof BaseCtrl;
    instance_ctrl: BaseCtrl;
    path: string;
    childs = [] as RouterConfigNode[];
    parent: RouterConfigNode;
    outset: string;
    redirect_to: string;
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
    /**找到当前 */
    public get redirect_node(): RouterConfigNode {
        if (!this.redirect_to) {
            return;
        }
        if (!this.parent) {
            return;
        }
        let path_arr = splitPath(this.redirect_to);
        let wrap_node = this.parent;
        while (true) {
            if (path_arr[0] == '..') {
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
    /** 添加childNode */
    public addChild(childNode: RouterConfigNode) {
        let childs_list = this.childs;
        childs_list.push(childNode);
        childNode.parent = this;
    }
    /** 删除childNode */
    public removeChild(childNode: RouterConfigNode) {
        let child_index = this.childs.indexOf(childNode);
        if (child_index == -1) {
            return;
        }
        this.childs.splice(child_index, 1);
    }
    public removeChildren() {
        for (let len = this.childs.length, i = len - 1; i >= 0; i--) {
            this.childs[i].destroy();
        }
        this.childs = [];
    }
    public findChildNodeByPath(path_map: string[]): RouterConfigNode {
        if (path_map.length == 0) {
            return this;
        }

        let cur_path = path_map.shift();
        let children = this.childs;
        for (let i = 0; i < children.length; i++) {
            if (children[i].path == cur_path) {
                return children[i].findChildNodeByPath(path_map);
            }
        }
        return null;
    }
    public createChildByConfig(config: RouterConfig) {
        for (let i = 0; i < config.length; i++) {
            let config_item = config[i];
            let config_node = new RouterConfigNode({
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
