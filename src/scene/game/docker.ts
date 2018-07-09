import { BaseCtrl } from '../../mcTree/ctrl/base';

export interface Link {
    view: Laya.Node;
    wire: Laya.Sprite;
    tip: Laya.Sprite;
    arrow: Laya.Sprite;
}

/**  */
export class DockerCtrl extends BaseCtrl {
    protected link = {} as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const view = this.link.view as any;
        const wire = view.wire;
        const tip = view.tip;
        const arrow = view.arrow;

        this.link.wire = wire;
        this.link.tip = tip;
        this.link.arrow = arrow;
    }
    protected initEvent() {}
    public start() {
        const { wire, tip, arrow } = this.link;
        wire.visible = true;
        tip.visible = true;
        arrow.visible = true;
    }
    public reset() {
        const { wire, tip, arrow } = this.link;
        wire.visible = false;
        tip.visible = false;
    }
}
