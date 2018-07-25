import { BaseCtrl } from '../../mcTree/ctrl/base';
import { CMD } from '../../data/cmd';
import { isNumber } from 'lodash';

export interface Link {
    view: ui.game.cardHeapUI;
    heap: Laya.Box;
    remain_num: Laya.Text;
}

/**  */
export class CardHeapCtrl extends BaseCtrl {
    public name = 'card_heap_ctrl';
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
    protected initLink() {
        const { view } = this.link;
        const { remain_num, heap } = view;

        this.link = {
            heap,
            remain_num,
            view,
        };
    }
    protected initEvent() {
        const { view } = this.link;
        view.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.TAKE);
        });
    }
    public setRemainCard(num: number) {
        if (!isNumber(num)) {
            return;
        }
        const { remain_num } = this.link;
        remain_num.text = `剩余${num}张`;
    }
    public reset() {
        this.setRemainCard(0);
    }
}
