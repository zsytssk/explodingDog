import { BaseCtrl } from '../../../mcTree/ctrl/base';

type UI = ui.popup.component.cardPackBaseUI;
type Link = {
    view: UI;
};
export class CardPackCtrl {
    protected type: string;
    protected link = {} as Link;
    constructor(view: UI) {
        this.link.view = view;
    }

    public setType(cardType: number) {
        const { view } = this.link;
        const { bg, describe } = view;
        bg.skin = `images/component/cardType/icon_card${cardType}.png`;
        describe.skin = `images/component/cardType/text_des${cardType}.png`;

        if (cardType > 1) {
            const ani = new Laya.Skeleton();
            ani.pos(0.5 * view.width, 0.4 * view.height);
            view.addChild(ani);
            ani.load(
                `animation/cardpack${cardType}.sk`,
                new Laya.Handler(this, () => {
                    ani.play(0, false);
                }),
            );
        }
    }
}
