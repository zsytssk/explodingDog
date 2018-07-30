import { maxBy } from 'lodash';

import * as animate from '../utils/animate';
import {
    getElementsByName,
    isClosest,
    log,
    querySiblings,
} from '../utils/zutil';
import { FullScreenBgCtrl } from './bg';
import { DisplayStyle, NodeCtrl } from './node';

/** 弹出层的状态 正在显示 | 显示 | 正在关闭 | 关闭   */
type Status = 'showing' | 'shown' | 'hiding' | 'hidden';
export interface Link {
    /** 用来做切换页面关闭弹出层  */
    pop_view: Laya.Sprite;
    bg_ctrl: FullScreenBgCtrl;
    btn_confirms?: Laya.Button[];
    btn_cancel?: Laya.Button;
    close_list?: Laya.Node[];
}
export type HideTrigger = 'close' | 'confirm' | 'bg';
export type ShowAni = '' | 'fade_in' | 'scale_in' | 'slide_up_in'; // 显示的动画
export type HideAni = '' | 'fade_out' | 'scale_out' | 'slide_down_out'; // 隐藏的动画
export type Pos = '' | 'middle' | 'bottom'; //

export type HideData = { trigger: HideTrigger };

export const cmd = {
    /**  已经隐藏 */
    hidden: 'hidden',
    /**  开始隐藏 */
    hide: 'hide',
    /**  开始隐藏 */
    hiding: 'hiding',
    /** 显示 */
    show: 'show',
    /**  开始显示 */
    showing: 'showing',
    /**  已经显示 */
    shown: 'shown',
};

const bg_alpha = 0.7;

/** 弹层公共类  */
export abstract class PopCtrl extends NodeCtrl {
    public status: Status = 'hidden';
    protected is_initiated: boolean = false;
    protected show_bg: boolean = true;
    protected display_style = 'on_box' as DisplayStyle;
    protected show_animate: ShowAni = 'scale_in';
    protected show_time: number = 0.5;
    protected hide_animate: HideAni = 'scale_out';
    protected hide_time: number = 0.5;
    protected position: Pos = 'middle';
    protected link = {} as Link;
    protected hit_bg_close: boolean = true;
    protected bg_color = '#000';
    constructor(view_class) {
        super(new Laya.Sprite());
        this.view_class = view_class;
    }
    public init() {
        this.preInit();
    }
    /** 预初始化 在加载资源之前 初始化事件 比方说show  */
    // tslint:disable-next-line:no-empty
    protected preInit() {}
    public preparePop() {
        if (!this.is_initiated) {
            this.initView();
            this.initLink();
            this.initEvent();
            this.is_initiated = true;
        }
    }
    public enter() {
        return this.show();
    }
    public leave() {
        this.hide();
    }
    /** pop的dom结构
     * pop(Sprite): bg + popUI
     */
    protected initView(): void {
        this.initBg();
        const view = this.view;

        view.width = Laya.stage.width;
        view.height = Laya.stage.height;

        const pop_view = new this.view_class();
        this.view.addChild(pop_view);
        this.link.pop_view = pop_view;
    }
    /**  初始化背景   */
    private initBg() {
        if (!this.show_bg) {
            return false;
        }
        let bg_color = this.bg_color;
        let alpha = bg_alpha;
        // 黑色背景
        if (bg_color === 'transparent') {
            bg_color = '#000';
            alpha = 0;
        }
        const bg_ctrl = new FullScreenBgCtrl(bg_color, alpha);
        this.addChild(bg_ctrl);
        bg_ctrl.init();
        this.link.bg_ctrl = bg_ctrl;
    }
    /**  初始化快捷绑定   */
    protected initLink() {
        const view = this.view;

        const btn_cancel = getElementsByName(
            view,
            'btn_cancel',
        )[0] as Laya.Button;
        const btn_confirms = getElementsByName(
            view,
            'btn_confirm',
        ) as Laya.Button[];

        let close_list = getElementsByName(view, 'close');
        close_list.push(btn_cancel);
        close_list = close_list.concat(btn_confirms);

        this.link.btn_cancel = btn_cancel;
        this.link.btn_confirms = btn_confirms;
        this.link.close_list = close_list;
    }
    /**  初始化事件   */
    protected initEvent() {
        const close_list = this.link.close_list;
        close_list.forEach((close_item, index) => {
            if (!close_item) {
                return true;
            }

            close_item.on(Laya.Event.CLICK, this, () => {
                let trigger: HideTrigger = 'close';
                // 确定按钮的处理
                if (
                    this.link.btn_confirms.indexOf(
                        close_item as Laya.Button,
                    ) !== -1
                ) {
                    log('点击了 <确定> 按钮');
                    trigger = 'confirm';
                }

                log('点击了 <关闭> 按钮');
                this.hide(trigger);
            });
        });

        // 点击其他地方关闭
        this.onNode(Laya.stage, Laya.Event.CLICK, event => {
            if (!this.view || !this.view.displayedInStage) {
                return;
            }
            /**  如果弹出层已经关闭||正在关闭不做处理   */
            if (this.status === 'hidden' || this.status === 'hiding') {
                return;
            }
            /**  如果有背景点击的区域不是背景 不做处理   */
            if (this.show_bg && !isClosest(event.target, this.view)) {
                return;
            }
            /**  点击阴影不关闭, 默认关闭   */
            if (!this.hit_bg_close) {
                return;
            }
            /**  如果点击的区域在弹层中不做处理   */
            if (isClosest(event.target, this.link.pop_view)) {
                return;
            }
            this.hide('bg');
        });
    }
    /**  窗口自适应   */
    protected resize() {
        const pop_view = this.link.pop_view;
        if (!pop_view) {
            return;
        }
        const bg_ctrl = this.link.bg_ctrl;
        const screen_width = Laya.stage.width;
        const screen_height = Laya.stage.height;

        if (this.position !== 'middle') {
            return;
        }
        pop_view.pivot(pop_view.width / 2, pop_view.height / 2);
        pop_view.x = screen_width / 2;
        pop_view.y = screen_height / 2;

        /**  没有背景的时候无需设置bg_ctrl.update   */
        if (!this.show_bg) {
            return;
        }
        bg_ctrl.update(screen_width, screen_height);
    }
    /**  显示   */
    public async show() {
        /** 如果弹层还没有初始化 先enter...  */
        if (!this.is_initiated) {
            await this.preparePop();
        }
        return new Promise((resolve, reject) => {
            const view = this.view;
            const pop_view = this.link.pop_view;
            const show_fn = animate[this.show_animate];
            const show_time = this.show_time * 1000;

            this.setTopZOrder();
            /**  如果弹出层已经显示或者正在显示不做处理   */
            if (this.status === 'shown' || this.status === 'showing') {
                return;
            }
            this.status = 'showing';
            this.resize();
            this.trigger(cmd.showing);
            super.show();
            (view as Laya.Sprite).visible = true;
            show_fn(pop_view, show_time, () => {
                this.status = 'shown';
                this.trigger(cmd.shown);
                resolve();
            });
        });
    }

    /**  隐藏  */
    public hide(trigger?: HideTrigger) {
        return new Promise((resolve, reject) => {
            const view = this.view;
            const pop_view = this.link.pop_view;
            const hide_fn = animate[this.hide_animate];
            const hide_time = this.hide_time * 1000;

            /** 如果弹出层已经关闭||正在关闭不做处理   */
            if (this.status === 'hidden' || this.status === 'hiding') {
                return;
            }
            this.status = 'hiding';
            this.trigger(cmd.hiding, { trigger });
            hide_fn(pop_view, hide_time, () => {
                super.hide();
                this.status = 'hidden';

                this.resetZOrder();
                this.trigger(cmd.hidden, { trigger });
                // 隐藏之后执行 执行
                resolve();
            });
        });
    }
    /** 将弹出层的层级设置为最高  */
    private setTopZOrder() {
        const siblings = querySiblings(this);
        const top_pop = maxBy(siblings, sibling => {
            return sibling.zOrder < 10 ? sibling.zOrder : 0;
        });

        if (top_pop && this.getZOrder() <= top_pop.zOrder) {
            this.setZOrder(top_pop.zOrder);
        }
    }
    /** 将弹出层的层级设置为最高  */
    private resetZOrder() {
        if (this.getZOrder() >= 10) {
            return;
        }
        this.setZOrder(0);
    }
    protected reset() {
        // 重置fu父类  */
    }
}
