import { BaseCtrl } from '../../mcTree/ctrl/base';

export interface Link {
    view: Laya.Node;
}

/**  */
export class PlayerCtrl extends BaseCtrl {
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
