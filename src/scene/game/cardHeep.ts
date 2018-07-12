import { BaseCtrl } from '../../mcTree/ctrl/base';
import { CMD } from '../../data/cmd';

export interface Link {
    view: ui.game.cardHeapUI;
}

/**  */
export class CardHeapCtrl extends BaseCtrl {
    protected link = {} as Link;
    constructor(view: ui.game.cardHeapUI) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    // tslint:disable-next-line:no-empty
    protected initLink() {}
    protected initEvent() {
        const { view } = this.link;
        view.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.TAKE);
        });
    }
}
