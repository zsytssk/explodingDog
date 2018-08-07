import { PopupCards } from '../popup/popupCards';
import { checkLogin, getAvatar } from '../../utils/tool';
import { PopupJoinRoom } from '../popup/popupJoinRoom';
import { rankIcon } from './rankIcon';
import { PopupHelp } from '../popup/popupHelp';
import { PopupShop } from '../popup/popupShop';
import { loadAssets } from '../loaing/main';
import { GuideView } from '../guide/guideView';
import { PopupAvatar } from '../popup/popupAvatar';
import { BgCtrl } from '../bgCtrl';

export class HallContent extends ui.hall.hallcontentUI {
    rank: Laya.Box; //段位
    constructor() {
        super();
        this.init();
    }
    init() {
        const { bg } = this;
        const bg_ctrl = new BgCtrl(bg);
        bg_ctrl.init();
        this.expBar.bar.y = 2;
        this.initEvent();
    }
    initEvent() {
        const { btnPlay, btnCreate, btnJoin, btn_help, btn_shop, btn_tutorial, avatar } = this;
        btnPlay.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            let popupCards = new PopupCards();
            popupCards.setType('play');
            Sail.director.popScene(popupCards);
        });
        btnCreate.on(Laya.Event.CLICK, this, () => {
            if (!checkLogin()) {
                return;
            }
            let popupCards = new PopupCards();
            popupCards.setType('create');
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
        btn_shop.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupShop());
        });
        btn_tutorial.on(Laya.Event.CLICK, this, () => {
            loadAssets('guide').then(() => {
                Sail.director.runScene(new GuideView());
            });
        });
        avatar.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupAvatar());
        })
    }
    updateView(data) {
        this.userName.changeText(data.nickname);
        this.level.changeText(`Lv:${data.level}`);
        this.totalRound.changeText(`场次:${data.totalPlayCount}`);
        this.winrate.changeText(`胜率:${data.winRate.toFixed(2)}%`);
        this.score.changeText(`积分:${data.score}`);
        this.expBar.value = data.currentExp / data.nextLevelExp;
        this.avatar.skin = getAvatar(data.avatar);
        this.rank = new rankIcon(data.danGrading);
        this.rank.pos(35, 395);
        this.userInfoBox.addChild(this.rank);
    }
}
