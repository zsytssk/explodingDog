import { BaseEvent } from '../../../mcTree/event';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { tween } from '../../../mcTree/utils/animate';

type UI = ui.popup.setting.checkBoxUI;
type Link = {
    view: UI;
    progress_node: Laya.ProgressBar;
    on_node: Laya.Sprite;
    off_node: Laya.Sprite;
    sign_node: Laya.Sprite;
};
type Status = 'checked' | 'uncheck';
const sign_pos = {
    end: 135,
    start: 0,
};
export const cmd = {
    status_change: 'status_change',
};
export type StatusData = {
    status: Status;
};
export class CheckCtrl extends BaseCtrl {
    protected link = {} as Link;
    private status: Status;

    constructor(view: UI) {
        super();
        this.link.view = view;
        this.init();
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    private initLink() {
        const { off_node, sign_node, on_node, progress_node } = this.link.view;
        this.link = {
            ...this.link,
            off_node,
            on_node,
            progress_node,
            sign_node,
        };
    }
    private initEvent() {
        const { view } = this.link;
        this.onNode(view, Laya.Event.CLICK, this.toggle);
    }
    private toggle() {
        if (this.status === 'checked') {
            this.setStatus('uncheck');
        } else {
            this.setStatus('checked');
        }
    }
    public setStatus(status: Status, isInit: boolean = false) {
        const { sign_node, progress_node, off_node, on_node } = this.link;
        if (this.status === status) {
            return;
        }
        this.status = status;
        const sign_x = status === 'checked' ? sign_pos.end : sign_pos.start;
        const progress_value = status === 'checked' ? 1 : 0;
        const time = isInit ? 0 : null;
        tween({
            end_props: { x: sign_x },
            sprite: sign_node,
            time
        }).then(() => {
            if (status === 'checked') {
                off_node.visible = false;
                on_node.visible = true;
            } else {
                off_node.visible = true;
                on_node.visible = false;
            }
            !isInit && this.trigger(cmd.status_change, { status });
        });
        tween({
            end_props: { value: progress_value },
            sprite: progress_node,
            time
        });
    }
}
