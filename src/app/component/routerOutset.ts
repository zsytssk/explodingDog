import { NodeCtrl } from './node';
/**
 * router的包裹ctrl
 */
export class RouterOutsetCtrl extends NodeCtrl {
    public readonly name = 'router_outset';
    private no_size: boolean;
    /**router的包裹ctrl
     * @param no_size 节点是否是没有大小
     */
    constructor(no_size?: boolean) {
        super(new Laya.Sprite());
        this.no_size = no_size;
    }
    public init() {
        // this.initEvent();
    }
}
