import { CMD } from '../../../data/cmd';

export class CardPack extends ui.popup.component.cardPackUI {
    constructor(data) {
        super();
        this.init(data);
    }

    init({ isLock, cardType, staminaCost }) {
        this.bg.skin = `images/cards/icon_card${cardType}.png`;
        this.chooseBtn.skin = isLock ? `images/cards/btn_lock.png` : `images/cards/btn_choose.png`;
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
                    break;
                case 'choose':
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
    }
}