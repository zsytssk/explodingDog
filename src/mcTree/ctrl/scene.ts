import { load_util } from '../utils/load';
import { DisplayStyle, NodeCtrl } from './node';

/**
 * 场景控制器eg: hall room ...
 */
export class SceneCtrl extends NodeCtrl {
    public view: Laya.Sprite;
    public display_style: DisplayStyle = 'on_box';
    protected is_initialized: boolean = false;
    constructor(view_class) {
        super(view_class);
    }
    // tslint:disable-next-line:no-empty
    public init() {}
    /** 进入场景
     * @param callback 返回函数
     */
    protected enter() {
        return new Promise((resolve, reject) => {
            load_util.load(this.name).then(() => {
                /** 如果此时 ctrl 已经不在ctrl树中, ctrl 已经 leave 了 这时候不用初始化了 */
                if (!this.in_ctrl_tree) {
                    return;
                }
                if (!this.is_initialized) {
                    this.initView();
                    this.resize();
                    this.is_initialized = true;
                }
                this.show();
            });
        });
    }
    protected leave() {
        return new Promise((resolve, reject) => {
            this.hide();
            this.destroy();
            resolve();
        });
    }
    /** 页面大小变化时 页面内容始终居中 */
    protected resize() {
        const view = this.view;
        if (!view) {
            return true;
        }
        view.y = (Laya.stage.height - view.height) / 2;
    }
}
