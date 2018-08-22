import { countDown } from "../../mcTree/utils/animate";
import { CMD } from "../../data/cmd";

export class PopUpInvite extends ui.popup.popupPromptUI {
    zOrder = 5;
    countDown: Laya.Label;
    richText: Laya.HTMLDivElement;

    constructor(username, countdown) {
        super();
        this.init(username, countdown);
        this.initEvent();
        this.setText(username);
        this.startCountdown(countdown);
    }
    init(username, countdown) {
        this.btnEnsure.skin = 'images/component/btn_accept.png';
        this.btnCancle.skin = 'images/component/btn_refuse.png';
        this.tipLabel.visible = false;
        let richText = this.richText = new Laya.HTMLDivElement();
        richText.size(420, 150);
        richText.pos(110, 140);
        richText.style.valign = 'middle';
        richText.style.align = 'center';
        richText.style.font = 'Microsoft YaHei';
        richText.style.leading = 20;
        richText.style.fontSize = 36;
        richText.style.bold = true;
        richText.style.wordWrap = true;
        let countDownBg = new Laya.Image('images/component/invite_countdown.png');
        countDownBg.pos(530, 180);
        let countDown = this.countDown = new Laya.Label();
        countDown.font = 'impact';
        countDown.color = '#ffffff';
        countDown.fontSize = 50;
        countDown.align = 'center';
        countDown.rotation = 10;
        countDown.pos(70, 65);
        countDownBg.addChild(countDown);
        this.addChildren(richText, countDownBg);
    }

    initEvent() {
        this.btnEnsure.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.UPDATE_INVITE, { status: 1 });
        });
        this.btnCancle.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.UPDATE_INVITE, { status: 2 });
        });
        this.btnClose.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.UPDATE_INVITE, { status: 2 });
        });
    }

    private setText(username) {
        this.richText.innerHTML = `<font color="#fcb815">${username}</font><font color="#ffffff">希望再来一局游戏，是否与他继续游戏？</font>`;
    }
    private startCountdown(countdown) {
        if (countdown < 0) {
            this.close();
            return;
        }
        this.countDown.text = countdown;
        this.timerOnce(1000, this, () => {
            this.startCountdown(--countdown);
        })
    }
}