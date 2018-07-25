import { CardModel } from '../model/card/card';
import { CurSeatCtrl } from '../seat/curSeat';
import { PopupTakeExplode } from '../../popup/popupTakeExplode';

export class PopupDefuse extends ui.popup.popupDefuseUI {
    name = 'popup_defuse';
    group = 'exploding';
    ani: Laya.Skeleton;
    defuseSeccess = false;//弹出popup_take_explode弹层
    curSeatCtrl;
    constructor(remainTime) {
        super();
        this.init(remainTime);
    }
    init(remainTime) {
        this.ani = new Laya.Skeleton();
        this.ani.pos(675, 355);
        this.ani.load(
            'animation/chaidan.sk',
            new Laya.Handler(this, () => {
                this.ani.play(0, false);
                if (remainTime && !isNaN(remainTime)) {
                    let rate = 6 / remainTime;
                    this.ani.playbackRate(rate);
                }
                this.addChild(this.ani);
            }),
        );
        this.defuseCard.zOrder = 5;
        this.card_box_wrap.zOrder = 5;
    }
    setCards(cards: CardModel[], cur_seat_ctrl: CurSeatCtrl) {
        const { card_box_wrap, ani } = this;
        this.curSeatCtrl = cur_seat_ctrl;
        cur_seat_ctrl.putCardBoxInWrap(card_box_wrap, this);
    }
    defuseSuccess() {
        this.ani.paused();
        this.defuseCard.visible = true;
        this.defuseSeccess = true;
    }
    onClosed() {
        if (this.curSeatCtrl) {
            this.curSeatCtrl.putCardBoxBack();
        }
        if (!this.defuseSeccess) {
            Sail.director.popScene(new PopupTakeExplode());
        }
    }

}
