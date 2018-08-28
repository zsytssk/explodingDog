import { CurSeatCtrl } from './../seat/curSeat';
import { CMD } from '../../../data/cmd';
import { PopupTakeExplode } from '../../popup/popupTakeExplode';
import { CardModel } from '../model/card/card';
import { getSoundPath } from '../../../utils/tool';

export class PopupDefuse extends ui.popup.popupDefuseUI {
    CONFIG = {
        shadowAlpha: 0.8
    }
    public name = 'popup_defuse';
    public group = 'exploding';
    public remainTime: number; // 倒计时 s
    public ani: Laya.Skeleton;
    public defuseSeccess = false; // 弹出popup_take_explode弹层
    private clickTimes = 0; // 点击3次爆炸
    public curSeatCtrl: CurSeatCtrl;
    constructor(remainTime) {
        super();
        this.init(remainTime);
    }
    public init(remainTime) {
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
    public onOpened() {
        if (!this.curSeatCtrl.haveCard('3101')) {
            this.timerLoop(1000, this, this.countdown);
            Laya.stage.on(Laya.Event.CLICK, this, this.onClickAction);
        } else {
            this.curSeatCtrl.showCardTip('3101');
        }
    }
    public onClickAction() {
        if (this.remainTime <= 0) {
            return;
        }
        if (this.clickTimes++ == 2) {
            Laya.stage.off(Laya.Event.CLICK, this, this.onClickAction);
            this.clearTimer(this, this.countdown);
            Sail.io.emit(CMD.HIT, {
                hitCard: 3001,
            });
            return;
        }
        if (this.remainTime > 2) {
            this.ani.playbackRate(
                (this.ani.player.playbackRate * this.remainTime) /
                (this.remainTime - 2),
            );
        }
        this.remainTime -= 2;
    }
    public countdown() {
        if (this.remainTime <= 0) {
            this.clearTimer(this, this.countdown);
            Sail.io.emit(CMD.HIT, {
                hitCard: 3001,
            });
            return;
        }
        this.remainTime--;
    }
    public setCards(cards: CardModel[], cur_seat_ctrl: CurSeatCtrl) {
        const { card_box_wrap } = this;
        this.curSeatCtrl = cur_seat_ctrl;
        cur_seat_ctrl.putCardBoxInWrap(card_box_wrap, Laya.stage);
    }
    public defuseSuccess() {
        Laya.SoundManager.stopSound(getSoundPath('bomb1'));
        this.ani.paused();
        this.faceAni.visible = true;
        this.defuseCard.visible = true;
        this.defuseSeccess = true;
    }
    public closeEffect = new Laya.Handler(this, () => {
        if (this.curSeatCtrl) {
            this.curSeatCtrl.putCardBoxBack();
        }
        Sail.director.dialog.closeEffect.runWith(this);
    });
    public onClosed() {
        Laya.stage.off(Laya.Event.CLICK, this, this.onClickAction);
        // if (
        //     !this.defuseSeccess &&
        //     !Sail.director.getDialogByName('popup_take_explode')
        // ) {
        //     Sail.director.popScene(new PopupTakeExplode());
        // }
    }
}
