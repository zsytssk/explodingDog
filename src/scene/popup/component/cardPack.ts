import { CMD } from '../../../data/cmd';
import { log } from '../../../mcTree/utils/zutil';
import { CardPackCtrl } from './cardPackBase';
export class CardPack extends ui.popup.component.cardPackUI {
    /** choose,play,create */
    private type: 'choose' | 'play' | 'create';
    constructor(data) {
        super();
        this.init(data);
    }

    protected init({ isLock, cardType, staminaCost }) {
        this.type = cardType;
        const { pack_base } = this;
        const card_pack_ctrl = new CardPackCtrl(pack_base);
        card_pack_ctrl.setType(cardType);

        (this.chooseBtn as Laya.Image).mouseEnabled = !isLock;
        this.iconI.visible = isLock;
        if (staminaCost) {
            this.staminaLabel.text = `${Math.abs(staminaCost)}`;
        }
        this.initEvent(cardType);
    }

    private initEvent(cardType) {
        (this.chooseBtn as Laya.Image).on(Laya.Event.CLICK, this, () => {
            switch (this.type) {
                case 'play':
                    Sail.io.emit(CMD.JOIN_ROOM, {
                        cardType,
                        type: 'quick',
                    });
                    break;
                case 'create':
                    Sail.io.emit(CMD.CREATE_ROOM, {
                        cardType,
                    });
                    break;
                case 'choose':
                    Sail.io.emit(CMD.CHANGE_CARD_TYPE, {
                        cardType,
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
    public setType(type) {
        this.type = type;
        if (type !== 'play') {
            this.staminaBox.visible = false;
        }
    }
}
