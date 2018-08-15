import { CardBoxCtrl } from './cardBox';
import { Subscriber } from 'rxjs';

export type Type = 'alter_future' | 'see_future';
export interface Link {
    card_box_ctrl: CardBoxCtrl;
}
export class PopupTheFutureUI extends ui.popup.popupTheFutureUI {
    private type: Type;
    public name = 'the_future';
    public observer: Subscriber<string[]>;
    private link = {} as Link;
    CONFIG = {
        autoClose: 12000
    }
    constructor() {
        super();

        this.init();
    }
    private init() {
        this.initLink();
        this.initEvent();
    }
    private initLink() {
        const { card_box, first_sign } = this;
        const card_box_ctrl = new CardBoxCtrl(card_box, first_sign);
        this.link = {
            ...this.link,
            card_box_ctrl,
        };
    }
    private initEvent() {
        const { btn_confirm } = this;

        /** 如果是 see_future直接关闭弹出层
         * alter_future需要在服务器收到命令再关闭
         */
        btn_confirm.on(Laya.Event.CLICK, this, () => {
            if (this.type === 'see_future') {
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
        const { header_see, header_alter } = this;
        if (type === 'alter_future') {
            header_alter.visible = true;
            card_box_ctrl.setCanSort(true);
        } else {
            header_see.visible = true;
            card_box_ctrl.setCanSort(false);
        }
        card_box_ctrl.addCards(data);
    }
}
