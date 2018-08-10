import { CMD } from '../../../data/cmd';
import { log } from '../../../mcTree/utils/zutil';
import { CardPackCtrl } from './cardPackBase';
import { PopupBuyCardType } from '../popupBuyCardType';
export class CardPack extends ui.popup.component.cardPackUI {
    /** choose,play,create */
    private type: 'choose' | 'play' | 'create';
    constructor(data) {
        super();
        this.init(data);
    }

    protected init(data) {
        const { isLock, cardType, staminaCost } = data;
        const { pack_base } = this;
        const card_pack_ctrl = new CardPackCtrl(pack_base);
        card_pack_ctrl.setType(cardType);

        (this.chooseBtn as Laya.Image).mouseEnabled = !isLock;
        this.chooseBtn.visible = !isLock;
        this.iconI.visible = cardType !== '1';
        this.btnLock.visible = isLock;
        if (staminaCost) {
            this.staminaLabel.text = `${Math.abs(staminaCost)}`;
        }
        this.initEvent(data);
    }

    private initEvent(data) {
        const { cardType, buyInfo } = data;
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
        this.iconI.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(
                new PopupBuyCardType(
                    {
                        card_id: buyInfo.itemId,
                        is_buy: !data.isLock,
                        price: buyInfo.price,
                    },
                    () => {
                        this.chooseBtn.visible = true;
                        this.btnLock.visible = false;
                    },
                ),
            );
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
