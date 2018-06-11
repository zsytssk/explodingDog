import { NodeCtrl } from './node';
import { CMD } from '../../data/cmd';
import { CONFIG } from '../../data/config';
/**
 * router的包裹ctrl
*/
export class RouterOutsetCtrl extends NodeCtrl {
    name = 'router_outset';
    private no_size: boolean;
    /**router的包裹ctrl
     * @param no_size 节点是否是没有大小
     */
    constructor(no_size?: boolean) {
        super(new Laya.Sprite());
        this.setSize();
        this.no_size = no_size;
    }
    public init() {
        this.initEvent();
    }
    protected initEvent() {
        this.on(CMD.global_resize, () => {
            this.setSize();
        });
    }
    public setSize() {
        if (this.no_size) {
            return;
        }
        let view = this.view;
        let screen_width = CONFIG.stage_width;
        let screen_height = CONFIG.stage_height;

        view.width = screen_width;
        view.height = screen_height;
    }
}