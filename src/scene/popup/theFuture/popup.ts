import { CardBoxCtrl } from './cardBox';
import { Subscriber } from 'rxjs';

export type Type = 'alter_the_future' | 'see_the_future';
export interface Link {
    card_box_ctrl: CardBoxCtrl;
}
export class PopupTheFutureUI extends ui.popup.popupTheFutureUI {
    private type: Type;
    public name = 'the_future';
    public observer: Subscriber<string[]>;
    private link = {} as Link;
    constructor() {
        super();

        this.init();
    }
    private init() {
        this.initLink();
        this.initEvent();
    }
    private initLink() {
        const { card_box } = this;
        const card_box_ctrl = new CardBoxCtrl(card_box);
        this.link = {
            ...this.link,
            card_box_ctrl,
        };
    }
    private initEvent() {
        const { btn_confirm } = this;

        /** 如果是 see_the_future直接关闭弹出层
         * alter_the_future需要在服务器收到命令再关闭
         */
        btn_confirm.on(Laya.Event.CLICK, this, () => {
            if (this.type === 'see_the_future') {
                Sail.director.closeByName('the_future');
            } else {
                this.replay();
            }
        });
    }
    public replay() {
        const { observer } = this;
        const { card_box_ctrl } = this.link;
        observer.next(card_box_ctrl.getCardsId());
        Sail.director.closeByName(this.name);
    }
    public updateView(
        type: Type,
        data: string[],
        observer: Subscriber<string[]>,
    ) {
        this.type = type;
        this.observer = observer;
        const { card_box_ctrl } = this.link;
        if (type === 'alter_the_future') {
            card_box_ctrl.can_sort = true;
        }
        for (const card of data) {
            card_box_ctrl.addCard(card);
        }
    }
}