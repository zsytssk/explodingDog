import { CMD } from '../../../data/cmd';

export class CardPack extends ui.popup.component.cardPackUI {
    constructor(data) {
        super();
        this.init(data);
    }

    init({ isLock, cardType, staminaCost }) {
        this.bg.skin = `images/cards/icon_card${cardType}.png`;
        this.chooseBtn.skin = isLock ? `images/cards/btn_lock.png` : `images/cards/btn_choose.png`;
        this.chooseBtn.mouseEnabled = !isLock;
        this.iconI.visible = isLock;
        this.staminaLabel.changeText(`(         - ${Math.abs(staminaCost)} ) `);
        this.initEvent(cardType);
    }

    initEvent(cardType) {
        this.chooseBtn.on(Laya.Event.CLICK, this, () => {
            switch (this.type) {
                case 'play':
                    Sail.io.emit(CMD.JOIN_ROOM, {
                        cardType: cardType,
                        type: 'quick'
                    });
                    break;
                case 'create':
                    Sail.io.emit(CMD.CREATE_ROOM, {
                        cardType: cardType
                    });
                    break;
                case 'choose':
                    Sail.io.emit(CMD.CHANGE_CARD_TYPE, {
                        cardType: cardType
                    });
                    Sail.director.closeByName('popupCards');
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 
     * @param type 页面类型 :choose,play,create
     */
    setType(type) {
        this.type = type;
        if (type == 'choose') {
            this.staminaBox.visible = false;
        }
    }
}