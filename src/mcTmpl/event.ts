import { callFunc } from '../utils/tool';
import { createRandomString, log, logAll } from './utils/zutil';

type i_hook_other_event = {
    /** 绑定对象id, 用于在清除的时候进行对比 */
    other_id: string;
    /** 绑定对象name, 用于展示 */
    other_name: string;
    /** 清除绑定事件 */
    off: FuncVoid;
    /** 事件名称 */
    event: string;
};

type i_hook_other_events = i_hook_other_event[];
type t_hook_fun_item = {
    /**  监听事件  */
    listener: FuncListener;
    /**  是否执行一次  */
    once: boolean;
    /**  清除事件函数绑定  */
    off: FuncVoid;
};
type t_hook_funs = {
    [x: string]: t_hook_fun_item[];
};

export const event = {
    destroy: 'destroy',
};
/** 事件基础类 */
export abstract class BaseEvent {
    /** id:> 每一个对象在创建时都会创建一个唯一id */
    public id: string;
    /** 是否销毁, 用于在销毁之后 有异步函数进入, 阻止其继续执行 */
    public is_destroyed: boolean = false;
    protected hook_funs: t_hook_funs = {};
    /** 绑定在别人身上的事件, 保存在这里用于销毁时 找到绑定的目标 去取消这些事件的绑定 */
    protected hook_other_funs = [] as i_hook_other_events;
    /** 储存所有的timetimeout interval 在destroy的时候清除 */
    protected timeout_list: number[] = [];
    protected interval_list: number[] = [];
    public readonly name: string = 'base_event';
    /** 事件基础类, 创建随机id */
    constructor() {
        this.id = createRandomString();
    }
    /**  监听事件  */
    public on(event_name: string, listener: FuncListener, once?: boolean) {
        if (typeof listener !== 'function') {
            log(`${this.name} bind ${event_name} with not a function`);
            return;
        }
        if (!this.hook_funs[event_name]) {
            this.hook_funs[event_name] = [];
        }
        const off = () => {
            this.off(event_name, listener);
        };
        const bind_obj = {
            listener,
            off,
            once: once ? once : false,
        };
        this.hook_funs[event_name].push(bind_obj);
        return {
            off,
        };
    }
    /**  监听一次事件  */
    public once(event_name: string, listener: FuncListener) {
        return this.on(event_name, listener, true);
    }
    /**
     * 触发自己绑定的事件evnt_name的绑定函数
     * @param event_name 事件名称
     * @param data 传过去的数据
     */
    protected trigger(event_name: string, data?) {
        if (!this.hook_funs[event_name]) {
            logAll(`${this.name} hasn't bind event:${event_name};`);
            return;
        }
        const hook_event_funs = this.hook_funs[event_name];
        for (let len = hook_event_funs.length, i = len - 1; i >= 0; i--) {
            /** 如果trigger destroy 就会导致别的ctrl|model绑定在这里的事件在执行listener
             * 就会全部清除, 这时候hook_event_funs为空, 执行下面的代码就会报错
             * 现在还没有什么方法解决这个问题 只能先跳过了 也许我可以将trigger的事件 异步执行
             */
            const hook_event_item = hook_event_funs[i];
            if (!hook_event_item) {
                continue;
            }
            const listener = hook_event_item.listener;
            const once = hook_event_item.once;
            listener(data);
            if (once) {
                hook_event_item.off();
            }
        }
    }
    /**
     * 撤销事件绑定
     * @param event_name 事件名称
     * @param track_info 索引方法的常量 可以是function或者绑定的token
     */
    public off(event_name: string, track_info?: FuncListener | string) {
        /** off all func bind event */
        if (!track_info) {
            this.hook_funs[event_name] = [];
            return;
        }
        const hook_list = this.hook_funs[event_name];
        if (!hook_list) {
            return;
        }

        for (let len = hook_list.length, i = len - 1; i >= 0; i--) {
            const listener = hook_list[i].listener;
            if (typeof track_info === 'function' && listener === track_info) {
                hook_list.splice(i, 1);
                return;
            }
        }
    }
    /**  撤销所有事件绑定  */
    protected offAll() {
        this.hook_funs = {};
    }

    /**  在其他的model或者ctrl上面绑定事件处理函数 */
    protected bindOtherEvent(
        other: BaseEvent,
        event_name: string,
        callback?: FuncListener,
        once?: boolean,
    ) {
        if (!other) {
            return;
        }
        const bind_info = other.on(event_name, callback, once);
        const bind_obj = {
            event: event_name,
            off: bind_info.off,
            other_id: other.id,
            other_name: other.name,
        };
        this.hook_other_funs.push(bind_obj);
        return bind_info;
    }
    /** 取消在其他的baseEvent绑定的事件处理 */
    protected offOtherEvent(otherObj) {
        if (!otherObj) {
            return;
        }

        const hook_funs = this.hook_other_funs;
        for (let len = hook_funs.length, i = len - 1; i >= 0; i--) {
            const hook_item = hook_funs[i];
            const other_id = hook_item.other_id;
            const off = hook_item.off;

            if (other_id !== otherObj._id) {
                continue;
            }

            off();
            hook_funs.splice(i, 1);
        }
    }
    /** 取消在其他的baseEvent绑定的事件处理 */
    protected offAllOtherEvent() {
        const hook_funs = this.hook_other_funs;
        for (let len = hook_funs.length, i = len - 1; i >= 0; i--) {
            const hook_item = hook_funs[i];
            hook_item.off();
            hook_funs.splice(i, 1);
        }
        this.hook_other_funs = [];
    }
    /**
     * 创建setTimeout, destroy时自动清除
     * @param fun 执行函数
     * @param time 延迟时间
     */
    protected createTimeout(fun: FuncVoid, time: number) {
        const time_out = window.setTimeout(() => {
            callFunc(fun);
            this.clearTimeout(time_out);
        }, time);
        this.timeout_list.push(time_out);
        return time_out;
    }
    /**
     * 创建setInterval
     * @param fun 执行函数
     * @param time 时间间隔
     */
    protected createInterval(fun: FuncVoid, time: number) {
        const interval = setInterval(fun, time);
        this.interval_list.push(interval);
        return interval;
    }
    /** 清除time_out setinterval */
    protected clearTimeout(time_out) {
        const timeout_list = this.timeout_list;
        const interval_list = this.interval_list;

        let index = timeout_list.indexOf(time_out);
        if (index !== -1) {
            timeout_list.splice(index, 1);
            return;
        }

        index = interval_list.indexOf(time_out);
        if (index !== -1) {
            interval_list.splice(index, 1);
            return;
        }
    }
    /** 清除time_out setinterval */
    protected clearAllTimeout() {
        const timeout_list = this.timeout_list;
        const interval_list = this.interval_list;
        for (const item of timeout_list) {
            clearTimeout(item);
        }
        for (const item of interval_list) {
            clearInterval(item);
        }
        this.timeout_list = [];
        this.interval_list = [];
    }
    public destroy() {
        this.trigger(event.destroy);
        this.clearAllTimeout();
        this.offAllOtherEvent();
        this.offAll();
        this.is_destroyed = true;
    }
}
