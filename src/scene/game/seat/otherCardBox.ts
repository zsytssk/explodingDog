import { BaseCtrl } from '../../../mcTmpl/ctrl/base';
export interface Link {
    view: Laya.Sprite;
}
/**  */
export class OtherCardBoxCtrl extends BaseCtrl {
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
}
