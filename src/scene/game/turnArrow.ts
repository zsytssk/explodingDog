import { BaseCtrl } from '../../mcTree/ctrl/base';

export interface Link {
    view: Laya.Node;
}

/** 指示箭头 */
export class TurnArrowCtrl extends BaseCtrl {
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
    public loadModel() {}
}
