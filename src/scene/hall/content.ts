import { PopupCards } from '../popup/popupCards';
import { checkLogin } from '../../utils/tool';
import { PopupJoinRoom } from '../popup/popupJoinRoom';
import { rankIcon } from './rankIcon';
import { PopupHelp } from '../popup/popupHelp';

export class HallContent extends ui.hall.hallcontentUI {
    rank: Laya.Box; //段位
    constructor() {
        super();
        this.init();
    }
    init() {
        this.expBar.bar.y = 2;
        this.initEvent();
    }
    initEvent() {
        const { btnPlay, btnCreate, btnJoin, btn_help } = this;
        btnPlay.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            let popupCards = new PopupCards();
            popupCards.setType('play');
            popupCards.popupEffect = null;
            popupCards.closeEffect = null;
            Sail.director.popScene(popupCards);
        });
        btnCreate.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            let popupCards = new PopupCards();
            popupCards.setType('create');
            popupCards.popupEffect = null;
            popupCards.closeEffect = null;
            Sail.director.popScene(popupCards);
        });
        btnJoin.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            Sail.director.popScene(new PopupJoinRoom());
        });
        btn_help.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupHelp());
        });
    }
    updateView(data) {
        this.userName.changeText(data.nickname);
        this.level.changeText(`Lv:${data.level}`);
        this.totalRound.changeText(`场次:${data.totalPlayCount}`);
        this.winrate.changeText(`胜率:${(data.winRate * 100).toFixed(2)}%`);
        this.score.changeText(`积分:${data.score}`);
        this.expBar.value = data.currentExp / data.nextLevelExp;
        this.rank = new rankIcon(data.danGrading);
        this.rank.pos(35, 395);
        this.userInfoBox.addChild(this.rank);
    }
}
