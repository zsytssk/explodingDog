import { BaseEvent } from '../event';
import {
    getCtrlTreePath,
    log,
    logErr,
    queryCheck,
    queryElements,
    queryTop,
} from '../utils/zutil';

type t_hook_node_fun_item = {
    /** 绑定的node */
    Node: Laya.Node;
    /** 清除绑定事件 */
    off: FuncVoid;
    /** 事件名称 */
    event: string;
};
type t_hook_node_funs = t_hook_node_fun_item[];

/**  ctrl 的基本类, 所有的事件处理类  */
export class BaseCtrl extends BaseEvent {
    public readonly name: string = 'base_ctrl';
    private hook_node_funs = [] as t_hook_node_funs;
    protected children = [] as BaseCtrl[];
    protected parent: BaseCtrl = null;
    /** 保存laya.utils.TimeLine */
    protected timeline_list = [] as laya.utils.TimeLine[];
    // tslint:disable-next-line:variable-name
    protected zOrder: number = 0;
    /** 在父元素中的order, 越大余额靠后, 用来处理场景切换, pop始终在最上面 */
    protected link: t_any_obj = {};
    /**  是否是最顶级的ctrl  */
    protected is_top: boolean = false;
    protected model: BaseEvent;
    public res_name: string;
    /** 添加view:any的作用是让处理将 GameNormalCtrl 赋值给 typeof BaseCtrl出错的问题 */
    constructor(view?: any) {
        super();
    }
    get ctrl_path(): string {
        return getCtrlTreePath(this);
    }
    /**  ctrl 是不是放在ctrl树中  */
    get in_ctrl_tree() {
        const top_ctrl = queryTop(this);
        if (top_ctrl.is_top) {
            return top_ctrl;
        }
        return null;
    }
    /** 报告事件, 传给当前ctrl的父级 包括自己
     * @param event_name 事件名称
     * @param destination 目标ctrl在目录树中的绝对地址
     * @param data 要传递的数据
     */
    public report(
        event_name: string,
        destination?: string | BaseCtrl,
        data?: t_any_obj,
    ) {
        if (!this.in_ctrl_tree) {
            logErr(`${this.name} not in ctrl tree`);
            return;
        }
        // ctrl_path是baseCtrl, 而不是字符串
        if (destination instanceof BaseCtrl) {
            destination.callBindFunc(event_name, data, false);
            return true;
        }
        /**  消息传给ctrl */
        this.passReportEvent(event_name, destination, data);
    }
    /** 向上传递事件
     * @param event_name 事件名称
     * @param ctrl_path:string 目标ctrl目录树中的地址,类式app::pop_wrap::alert
     * 如果是baseCtrl类, 就直接调用ctrl的相应方法
     * @param data 要传递的数据
     */
    public passReportEvent(
        event_name: string,
        ctrl_path: string | BaseCtrl,
        data,
    ) {
        // 如果没有指定目标ctrl_path, 就是向所有的节点广播
        if (!ctrl_path) {
            this.callBindFunc(event_name, data, true);
            if (!this.is_top) {
                this.parent.passReportEvent(event_name, ctrl_path, data);
            }
            return true;
        }

        // 目的地是字符串
        if (typeof ctrl_path !== 'string') {
            return;
        }

        const top_ctrl = queryTop(this);
        const query_arr = ctrl_path.split('::').map((item, index) => {
            return 'name:' + item;
        });
        const query_checked = queryCheck(top_ctrl, this, query_arr);
        /**  当前的ctrl就是event_name制定的ctrl  */
        if (query_checked) {
            this.callBindFunc(event_name, data, false);
            return true;
        }
        if (!this.is_top) {
            this.parent.passReportEvent(event_name, ctrl_path, data);
        }
    }
    /** 广播消息, 事件先找到最顶级的ctrl(包括自己)然后向下查找ctrl_path, 找到就继续相应的绑定函数
     * @param event_name 事件名称
     * @param destination 目标ctrl在目录树中的绝对地址
     * @param data 要传递的数据
     */
    public broadcast(
        event_name: string,
        destination?: string | BaseCtrl,
        data?: t_any_obj,
    ) {
        if (!this.in_ctrl_tree) {
            logErr(`${this.name} not in ctrl tree`);
            return;
        }
        const top_ctrl = queryTop(this);
        top_ctrl.passEmitEvent(event_name, destination, data);
    }
    /** 发射事件, 传给当前ctrl的子集 包括自己
     * @param event_name 事件名称`
     * @param destination 目标ctrl在目录树中的绝对地址
     * @param data 要传递的数据
     */
    public emit(
        event_name: string,
        destination?: string | BaseCtrl,
        data?: t_any_obj,
    ) {
        if (!this.in_ctrl_tree) {
            logErr(`${this.name} not in ctrl tree`);
            return;
        }
        if (typeof destination === 'string') {
            destination = this.ctrl_path + '::' + destination;
        }
        /**  消息传给ctrl */
        this.passEmitEvent(event_name, destination, data);
    }
    /** 向下传递事件
     * @param event_name 事件名称
     * @param ctrl_path:string 目标ctrl目录树中的地址,类式app::pop_wrap::alert
     * 如果是baseCtrl类, 就直接调用ctrl的相应方法
     * @param data 要传递的数据
     */
    public passEmitEvent(
        event_name: string,
        ctrl_path: string | BaseCtrl,
        data,
    ) {
        // 如果ctrl不再目录树中, 无需做处理
        if (!this.in_ctrl_tree) {
            logErr(`${this.name} not in ctrl tree`);
            return true;
        }
        // 如果没有指定目标ctrl_path, 就是向所有子节点的节点广播
        if (!ctrl_path) {
            this.callBindFunc(event_name, data, true);
            for (const child of this.children) {
                child.passEmitEvent(event_name, ctrl_path, data);
            }
            return true;
        }

        // ctrl_path是baseCtrl, 直接触发事件
        if (ctrl_path instanceof BaseCtrl) {
            ctrl_path.callBindFunc(event_name, data, false);
            return true;
        }

        // 目的地是字符串
        if (typeof ctrl_path !== 'string') {
            return;
        }
        /**将app::pop_wrap::alert 变成
         * name:pop_wrap name:alert..
         */
        const query_str = ctrl_path
            .replace(this.ctrl_path + '::', '')
            .split('::')
            .map((item, index) => {
                return 'name:' + item;
            })
            .join(' ');
        const ctrl_arr = queryElements(this, query_str);

        if (ctrl_arr.length === 0) {
            log(`can't find ctrl for ${ctrl_path}`);
            return;
        }
        for (const ctrl of ctrl_arr) {
            ctrl.callBindFunc(event_name, data, false);
        }
    }

    /**  执行event_name */
    /**
     * @param event_name 事件名称
     * @param data 要传递的数据
     * @param  is_broadcast 事件是否广播, 如果是就没有必要消失提示:>has no bind listener
     */
    protected callBindFunc(event_name: string, data, is_broadcast: boolean) {
        /**直接发送而且不是不是broadcast的发出提示
         * 如果直接使用trigger就没有这个提示了
         */
        if (!this.hook_funs[event_name]) {
            if (!is_broadcast) {
                log(
                    `ctrl://${
                        this.ctrl_path
                    } has no bind listener for event:${event_name}!`,
                );
            }
            return;
        }

        this.trigger(event_name, data);
    }
    /**  添加childCtrl  */
    public addChild(childCtrl: BaseCtrl) {
        const child_list = this.children;

        // 如果只有一个元素, 不需要这些只需要下面的操作
        if (!child_list.length) {
            child_list.push(childCtrl);
            childCtrl.parent = this;
            return;
        } else {
            // 用zOrder来定位this在父元素的childs中的顺序
            for (let i = child_list.length - 1; i >= 0; i--) {
                const child = child_list[i];
                if (child.zOrder <= childCtrl.zOrder) {
                    child_list.splice(i + 1, 0, childCtrl);
                    break;
                }
                if (i === 0) {
                    child_list.unshift(childCtrl);
                }
            }
        }

        childCtrl.parent = this;
    }
    /**  删除childCtrl  */
    public removeChild(childCtrl: BaseCtrl) {
        const child_index = this.children.indexOf(childCtrl);
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
    public setZOrder(zOrder: number) {
        const parent = this.parent;

        this.zOrder = zOrder;
        /** 如果元素有父元素, 将元素按zorder顺序放在父元素childs中 */
        if (!parent) {
            return;
        }
        const children = parent.children;
        const index = children.indexOf(this);
        if (children.length === 0) {
            return;
        }
        if (index === -1) {
            log(`error, this parent childs don't contain this;`);
            return;
        }
        children.splice(index, 1);
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child.zOrder <= zOrder) {
                children.splice(i + 1, 0, this);
                break;
            }

            // 如果没有任何元素的zOrder小于当前元素 放在第一位
            if (i === 0) {
                children.unshift(this);
            }
        }
    }
    public getZOrder(): number {
        return this.zOrder;
    }

    public getChildAt(index: number): BaseCtrl {
        if (index >= this.children.length) {
            return null;
        }
        return this.children[index];
    }
    public getChildByName(name: string): BaseCtrl {
        for (const child of this.children) {
            if (child.name === name) {
                return child;
            }
        }
        return null;
    }
    /**  获得ctrl子元素的个数  */
    public get numChildren(): number {
        return this.children.length;
    }
    /** 在model上面绑定事件处理函数 */
    protected onModel(event_name: string, callback?: FuncListener) {
        const model = this.model;
        if (!model) {
            return;
        }

        this.bindOtherEvent(model, event_name, callback);
    }
    /** 取消所有需要延迟执行的函数 */
    protected clearAllTimeout() {
        super.clearAllTimeout();
        for (const item of this.timeline_list) {
            item.destroy();
        }
        this.timeline_list = [];
    }
    /** 统一在节点上绑定事件, destroy时候统一清除 */
    protected onNode(
        node: Laya.Node,
        type: string,
        listener: FuncListener,
        once: boolean = false,
    ) {
        if (!node || !(node instanceof Laya.Node)) {
            log('bind node not exist!');
            return;
        }
        if (!type) {
            log('bind event not exist!');
            return;
        }
        if (!listener || typeof listener !== 'function') {
            log('bind function not exist!');
            return;
        }
        if (once) {
            node.once(type, this, listener);
        } else {
            node.on(type, this, listener);
        }
        const off = () => {
            node.off(type, this, listener);
        };
        this.hook_node_funs.push({
            Node: node,
            event: type,
            off,
        });
    }
    /**
     * 清除所有在node上绑定事件
     * @param node 要清除在node上绑定的事件
     */
    protected offNode(node: Laya.Node) {
        if (!node) {
            return;
        }

        const hook_funs = this.hook_node_funs;
        for (let len = hook_funs.length, i = len - 1; i >= 0; i--) {
            const hook_item = hook_funs[i];
            const Node = hook_item.Node;
            const off = hook_item.off;

            if (node !== Node) {
                continue;
            }

            off();
            hook_funs.splice(i, 1);
        }
    }
    /** 清除在所有node上绑定事件 */
    protected offAllNode() {
        const hook_funs = this.hook_node_funs;
        for (let len = hook_funs.length, i = len - 1; i >= 0; i--) {
            const hook_item = hook_funs[i];
            hook_item.off();
            hook_funs.splice(i, 1);
        }
        this.hook_node_funs = [];
    }
    /**  取消所有的事件绑定 从父类Ctrl中删除自己 删除model 删除link */
    public destroy() {
        // 取消所有的事件绑定
        super.destroy();
        // 清除在所有node上绑定事件
        this.offAllNode();
        // 取消所有需要延迟执行的函数
        this.clearAllTimeout();
        // 删除所有的子类
        this.removeChildren();

        if (this.parent) {
            this.parent.removeChild(this);
            this.parent = null;
        }
        this.link = null;
    }
}
