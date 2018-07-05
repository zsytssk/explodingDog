import { PopupCards } from '../popup/popupCards';
import { checkLogin } from '../../utils/tool';
import { PopupJoinRoom } from '../popup/popupJoinRoom';

export class HallContent extends ui.hall.hallcontentUI {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.expBar.bar.y = 2;
        this.initEvent();
    }
    initEvent() {
        this.btnPlay.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            let popupCards = new PopupCards();
            popupCards.setType('play');
            popupCards.popupEffect = null;
            popupCards.closeEffect = null;
            Sail.director.popScene(popupCards);
        });
        this.btnCreate.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            let popupCards = new PopupCards();
            popupCards.setType('create');
            popupCards.popupEffect = null;
            popupCards.closeEffect = null;
            Sail.director.popScene(popupCards);
        });
        this.btnJoin.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            Sail.director.popScene(new PopupJoinRoom());
        })

    }
    updateView(data) {
        this.userName.changeText(data.nickname);
        this.level.changeText(`Lv:${data.level}`);
        this.totalRound.changeText(`场次:${data.totalPlayCount}`);
        this.winrate.changeText(`胜率:${data.winRate * 100}%`);
        this.score.changeText(`积分:${data.score}`);
        this.expBar.value = data.currentExp / data.nextLevelExp;
    }
}
