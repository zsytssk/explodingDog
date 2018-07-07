import { BaseCtrl } from '../../../mcTmpl/ctrl/base';

export interface Link {
    view: Laya.Node;
}

/**  */
export class CardCtrl extends BaseCtrl {
    protected link = {} as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {}
    protected initEvent() {}
    /** 移动位置 */
    public tweenMove(index: number) {}
}
