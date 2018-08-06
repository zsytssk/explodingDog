import { CMD } from '../../data/cmd';
import { CardPack } from './component/cardPack';
import { TopBar } from '../hall/topbarCard';
import { getChildren } from '../../mcTree/utils/zutil';
import { BgCtrl } from '../bgCtrl';

const position2 = [190, 730]; //两个牌组时的定位
const position3 = [20, 460, 900]; //三个牌组时的定位

export class PopupCards extends ui.popup.popupCardsUI {
    private topbar: TopBar;
    private actions: SailIoAction;
    private type: 'play' | 'create';
    popupEffect = null;
    closeEffect = null;
    constructor() {
        super();
        this.init();
    }
    init() {
        this.name = 'popupCards';
        this.topbar = new TopBar();
        this.topbar.top = 20;
        this.addChild(this.topbar);

        const { bg } = this;
        const bg_ctrl = new BgCtrl(bg);
        bg_ctrl.init();

        this.initEvent();
        this.actions = {
            [CMD.CARD_TYPE_LIST]: this.initCardPack,
            [CMD.GET_USER_AMOUNT]: this.setUserAmount,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.CARD_TYPE_LIST);
        Sail.io.emit(CMD.GET_USER_AMOUNT);
    }

    initEvent() {
        this.topbar.btnBack.on(Laya.Event.CLICK, this, () => {
            this.close();
        });
    }

    /**
     * 设置类型
     * @param data choose:选择卡组、create:创建房间、play:快速游戏
     */
    setType(type) {
        this.topbar.setTitle(type);
        this.type = type;
    }

    initCardPack(data) {
        let list = data.list;
        if (Array.isArray(list)) {
            list.forEach((item, index) => {
                let cardPack = new CardPack(item);
                cardPack.setType(this.type);
                if (list.length == 2) {
                    cardPack.left = position2[index];
                } else if (list.length == 3) {
                    cardPack.left = position3[index];
                }
                this.cardBox.addChild(cardPack);
            });
        }
    }

    setUserAmount(data) {
        this.topbar.updateView(data);
    }
}
