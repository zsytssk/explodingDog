import { CMD } from '../../../data/cmd';
import { log } from '../../../mcTree/utils/zutil';
export class CardPack extends ui.popup.component.cardPackUI {
    /**choose,play,create */
    private type: string;
    constructor(data) {
        super();
        this.init(data);
    }

    init({ isLock, cardType, staminaCost }) {
        this.bg.skin = `images/component/cardType/icon_card${cardType}.png`;
        this.describe.skin = `images/component/cardType/text_des${cardType}.png`;
        (this.chooseBtn as Laya.Image).skin = isLock
            ? `images/component/cardType/btn_lock.png`
            : `images/component/cardType/btn_choose.png`;
        (this.chooseBtn as Laya.Image).mouseEnabled = !isLock;
        this.iconI.visible = isLock;
        if (staminaCost) {
            this.staminaLabel.text = `${Math.abs(staminaCost)}`;
        }
        if (cardType > 1) {
            let ani = new Laya.Skeleton();
            ani.pos(0.5 * this.width, 0.4 * this.height);
            this.addChild(ani);
            ani.load(
                `animation/cardpack${cardType}.sk`,
                new Laya.Handler(this, () => {
                    ani.play(0, false);
                }),
            );
        }
        this.initEvent(cardType);
    }

    initEvent(cardType) {
        (this.chooseBtn as Laya.Image).on(Laya.Event.CLICK, this, () => {
            switch (this.type) {
                case 'play':
                    Sail.io.emit(CMD.JOIN_ROOM, {
                        cardType: cardType,
                        type: 'quick',
                    });
                    break;
                case 'create':
                    Sail.io.emit(CMD.CREATE_ROOM, {
                        cardType: cardType,
                    });
                    break;
                case 'choose':
                    Sail.io.emit(CMD.CHANGE_CARD_TYPE, {
                        cardType: cardType,
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
        if (type != 'play') {
            this.staminaBox.visible = false;
        }
    }
}
