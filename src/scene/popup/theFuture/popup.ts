import { CardBoxCtrl } from './cardBox';
import { Subscriber } from 'rxjs';

export type Type = 'alter' | 'peek';
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
        btn_confirm.on(Laya.Event.CLICK, this, () => {
            this.replay();
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
        if (type === 'alter') {
            card_box_ctrl.can_sort = true;
        }
        for (const card of data) {
            card_box_ctrl.addCard(card);
        }
    }
}
