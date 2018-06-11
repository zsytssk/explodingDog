import { load_util } from '../../utils/load';
import { cmd as app_cmd } from '../app';
import { DisplayStyle, NodeCtrl } from './node';

/**
 * 场景控制器eg: hall room ...
 */
export class SceneCtrl extends NodeCtrl {
    public view: Laya.Sprite;
    public display_style: DisplayStyle = 'on_box';
    protected is_inited: boolean = false;
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
                /** 如果此时ctrl已经不在ctrl树中, ctrl已经leave了 这时候不用初始化了 */
                if (!this.in_ctrl_tree) {
                    return;
                }
                if (!this.is_inited) {
                    this.initView();
                    this.resize();
                    this.is_inited = true;
                }
                this.show();
            });
        });
    }
    protected leave(callback?) {}
    protected initLink() {}
    protected initEvent() {
        this.on(app_cmd.resize, () => {
            this.resize();
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
