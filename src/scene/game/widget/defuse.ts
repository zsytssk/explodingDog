
// import { CurCardBoxCtrl } from "../seat/cardBox/curCardBox";
import { CardModel } from "../model/card/card";

export class PopupDefuse extends ui.popup.popupDefuseUI {
    name = 'popup_defuse';
    ani: Laya.Skeleton;
    cardBoxCtrl;
    constructor(remainTime) {
        super();
        this.init(remainTime);
    }
    init(remainTime) {
        console.log('defuse----', remainTime)
        this.ani = new Laya.Skeleton();
        this.ani.pos(675, 355);
        this.ani.load('animation/chaidan.sk', new Laya.Handler(this, () => {
            this.ani.play(0, false);
            if (remainTime && !isNaN(remainTime)) {
                let rate = 6 / remainTime;
                this.ani.playbackRate(rate);
            }
            this.addChild(this.ani);
        }));
    }
    setCards(cards: CardModel[], card_box_ctrl) {
        const { card_box_wrap, ani } = this;
        this.cardBoxCtrl = card_box_ctrl;
        card_box_ctrl.putCardBoxInWrap(card_box_wrap);
    }
    defuseSuccess() {
        this.ani.paused();
        this.defuseCard.visible = true;
    }
}