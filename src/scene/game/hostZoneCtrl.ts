import { BaseCtrl } from '../../mcTmpl/ctrl/base';

export interface Link {
    view: Laya.Sprite;
}

/**  */
export class HostZoneCtrl extends BaseCtrl {
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
    public show() {
        this.link.view.visible = true;
    }
    public hide() {
        this.link.view.visible = false;
    }
}
