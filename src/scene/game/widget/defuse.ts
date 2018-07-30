import { CardModel } from '../model/card/card';
import { CurSeatCtrl } from '../seat/curSeat';
import { PopupTakeExplode } from '../../popup/popupTakeExplode';
import { CMD } from '../../../data/cmd';
import { log } from '../../../mcTree/utils/zutil';

export class PopupDefuse extends ui.popup.popupDefuseUI {
    name = 'popup_defuse';
    group = 'exploding';
    remainTime: number; //倒计时 s
    ani: Laya.Skeleton;
    defuseSeccess = false; //弹出popup_take_explode弹层
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
        this.remainTime = remainTime;
    }
    onOpened() {
        if (!this.curSeatCtrl.haveCard('3101')) {
            this.timerLoop(1000, this, this.countdown);
            Laya.stage.on(Laya.Event.CLICK, this, () => {
                if (this.remainTime <= 0) {
                    return;
                }
                this.ani.playbackRate(
                    (this.ani.player.playbackRate * this.remainTime) /
                        (this.remainTime - 2),
                );
                this.remainTime -= 2;
            });
        }
    }
    countdown() {
        if (this.remainTime <= 0) {
            this.clearTimer(this, this.countdown);
            Sail.io.emit(CMD.HIT, {
                hitCard: 3001,
            });
            return;
        }
        this.remainTime--;
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
    close() {
        i;
        super.close();
    }
    onClosed() {
        if (
            !this.defuseSeccess &&
            !Sail.director.getDialogByName('popup_take_explode')
        ) {
            Sail.director.popScene(new PopupTakeExplode());
        }
    }
}
