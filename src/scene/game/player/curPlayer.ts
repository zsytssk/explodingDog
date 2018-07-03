import { Link as BaseLink, PlayerCtrl } from './player';

export interface Link extends BaseLink {}

/**  */
export class CurPlayerCtrl extends PlayerCtrl {
    protected link = {} as Link;
    constructor(view) {
        super(view);
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {}
    protected initEvent() {}
    public loadModel() {}
}
