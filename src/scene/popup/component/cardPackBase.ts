import { PopupBuyCardType } from '../popupBuyCardType';

type UI = ui.popup.component.cardPackBaseUI;
type Link = {
    view: UI;
};
export type CardTypeData = {
    type: number;
    card_id: string;
    price: number;
    is_buy: boolean;
};
export class CardPackCtrl {
    protected type: string;
    protected link = {} as Link;
    private data: CardTypeData;
    private on_buy_complete: FuncVoid;
    constructor(view: UI, data: CardTypeData, on_buy_complete: FuncVoid) {
        this.link.view = view;
        this.on_buy_complete = on_buy_complete;
        this.data = data;
    }
    public init() {
        this.renderData();
        this.initEvent();
    }
    private initEvent() {
        const { icon_info } = this.link.view;
        const { data } = this;
        icon_info.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(
                new PopupBuyCardType(data, () => {
                    if (this.on_buy_complete) {
                        this.on_buy_complete();
                    }
                }),
            );
        });
    }
    public renderData() {
        const { data } = this;
        const { view } = this.link;
        const { bg, describe, icon_info } = view;
        const { type } = data;

        if (type + '' === '1') {
            icon_info.visible = false;
        }

        bg.skin = `images/component/cardType/icon_card${type}.png`;
        describe.skin = `images/component/cardType/text_des${type}.png`;

        if (type > 1) {
            const ani = new Laya.Skeleton();
            ani.pos(0.5 * view.width, 0.4 * view.height);
            view.addChild(ani);
            ani.load(
                `animation/cardpack${type}.sk`,
                new Laya.Handler(this, () => {
                    ani.play(0, false);
                }),
            );
        }
    }
}
