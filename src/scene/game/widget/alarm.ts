import { BaseCtrl } from '../../../mcTree/ctrl/base';

type View = ui.game.widget.alarmUI;
export interface Link {
    view: View;
}

/** 显示的位置 */
const show_pos = {
    x: 750,
    y: 283,
};
/** 隐藏的位置的位置 */
const hide_pos = {
    x: 1033,
    y: -261,
};
/**  */
export class AlarmCtrl extends BaseCtrl {
    protected link = {} as Link;
    constructor(view: View) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const { view } = this.link;

        this.link = {
            view,
        };
    }
    protected initEvent() {}
    public show() {}
}
