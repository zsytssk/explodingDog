import { isClosest } from '../../mcTmpl/utils/zutil';
import { BaseCtrl } from './base';
import { PopCtrl } from './pop';

export type DisplayStyle = '' | 'in_box' | 'on_box';
/** 所有页面节点ctrl的基础类 */
export class NodeCtrl extends BaseCtrl {
    /** 两种方式:
     * show_progress:>显示loading页面, 进度条变化;
     * in_background:>在后台加载
     */
    protected display_style: DisplayStyle = 'in_box';
    protected view_class: any;
    public view: Laya.Sprite;
    /** view 不在addChild进入其他的ctrl时改变位置 */
    public fixed_view = false;
    /** 父ctrl */
    protected parent: NodeCtrl = null;
    /** 子ctrl */
    protected children: NodeCtrl[] = [];
    /** 所有页面节点ctrl的基础类
     * @param view_class 是构造函数将其保存到view_class中
     * @param view_class 不是直接赋值给view
     */
    constructor(view_class: any) {
        super();
        if (typeof view_class === 'function') {
            // 构造函数
            this.view_class = view_class;
        } else {
            // 普通节点
            this.view = view_class;
        }
    }
    protected initView(): void {
        // 如果this.view未定义, 用view_class创建ui
        if (
            !this.view &&
            this.view_class &&
            typeof this.view_class === 'function'
        ) {
            this.view = new this.view_class();
        }
    }
    /** 显示view */
    public show(param?) {
        if (this.display_style === 'in_box') {
            (this.view as Laya.Sprite).visible = true;
        } else {
            this.parent.addChildView(this);
        }
    }
    /** 隐藏View */
    public hide() {
        if (this.display_style === 'in_box') {
            (this.view as Laya.Sprite).visible = false;
        } else {
            this.parent.view.removeChild(this.view);
        }
    }
    /** 添加childCtrl */
    public addChild(childCtrl: BaseCtrl) {
        super.addChild(childCtrl);

        if (childCtrl instanceof NodeCtrl) {
            // 将他的view添加到父类的view中
            if (childCtrl.display_style !== 'on_box') {
                // 将他的view从父类的view中去除
                this.addChildView(childCtrl);
            }
        }
    }
    /** 删除childCtrl */
    public removeChild(childCtrl: NodeCtrl) {
        // 将他的view从父类的view中去除
        if (childCtrl instanceof NodeCtrl) {
            this.removeChildView(childCtrl);
        }
        super.removeChild(childCtrl);
    }
    /** 在自己的view中 添加子类的view */
    private addChildView(childCtrl: NodeCtrl) {
        // childCtrl 不是this的子Ctrl下面不做处理
        const index = this.children.indexOf(childCtrl);

        if (index === -1) {
            return;
        }
        // view已经添加进去, 不用处理
        if (isClosest(childCtrl.view, this.view)) {
            return;
        }
        // fixed_view 专门钉死view的位置
        if (childCtrl.fixed_view) {
            return;
        }
        if (!(childCtrl as PopCtrl).noOrder) {
            (childCtrl.view as Laya.Sprite).zOrder = index;
        } else {
            (childCtrl.view as Laya.Sprite).zOrder = null;
        }
        this.view.addChild(childCtrl.view);
        this.refreshChildViewOrder();
    }
    /** 在自己的view中 移除子类的view */
    private removeChildView(childCtrl: NodeCtrl) {
        this.view.removeChild(childCtrl.view);
    }
    public setZOrder(zOrder: number) {
        super.setZOrder(zOrder);
        this.parent.refreshChildViewOrder();
    }
    /** 重新刷新子元素view的zOrder */
    public refreshChildViewOrder() {
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if ((child as NodeCtrl).view) {
                const view = (child as NodeCtrl).view;
                view.zOrder = i;
            }
        }
    }
    /** 删除View, 从父类Ctrl中删除自己 删除model 删除link */
    public destroy() {
        super.destroy();
        if (this.view) {
            this.view.destroy(true);
            this.view = null;
        }
    }
}
