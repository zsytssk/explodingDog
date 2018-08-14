import { CMD } from '../../../data/cmd';
import { CardPackCtrl } from './cardPackBase';
export class CardPack extends ui.popup.component.cardPackUI {
    /** choose,play,create */
    private type: 'choose' | 'play' | 'create';
    constructor(data) {
        super();
        this.init(data);
    }

    protected init(data) {
        const { isLock, buyInfo, cardType, staminaCost } = data;
        const { pack_base } = this;

        // (this.chooseBtn as Laya.Image).mouseEnabled = !isLock;
        this.chooseBtn.visible = !isLock;
        this.btnLock.visible = isLock;
        if (staminaCost) {
            this.staminaLabel.text = `${Math.abs(staminaCost)}`;
        }

        const pack_data = {
            card_id: buyInfo.itemId,
            is_buy: !data.isLock,
            price: buyInfo.price,
            type: cardType,
        };
        const card_pack_ctrl = new CardPackCtrl(pack_base, pack_data, () => {
            this.chooseBtn.visible = true;
            this.btnLock.visible = false;
        });
        card_pack_ctrl.init();

        this.initEvent(data);
    }

    private initEvent(data) {
        const { cardType, isLock } = data;
        if (isLock) {
            this.on(Laya.Event.CLICK, this, () => {

            })
        }
        this.chooseBtn.on(Laya.Event.CLICK, this, () => {
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
