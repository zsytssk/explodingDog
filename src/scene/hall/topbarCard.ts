import { ValueBar } from './valuebar';
import { PopupSetting } from '../popup/setting/pop';
import { CMD } from '../../data/cmd';
import { PopupShop } from '../popup/popupShop';
import { PopupCharge } from '../popup/popupCharge';
export class TopBar extends ui.hall.topbarCardUI {
    public stamina: ValueBar;
    public diamond: ValueBar;
    constructor() {
        super();
        this.init();
    }
    public init() {
        (this.stamina as ValueBar).setType('stamina');
        this.diamond.setType('diamond');
        this.initEvent();
        Sail.io.register(CMD.GET_USER_AMOUNT, this, this.updateView);
        Sail.io.emit(CMD.GET_USER_AMOUNT);
    }
    private initEvent() {
        const { btnSetting, stamina, diamond } = this;
        btnSetting.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupSetting());
        });
        stamina.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupShop());
        });
        diamond.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupCharge());
        });
    }

    public updateView({ bone, stamina, upperLimit }) {
        this.stamina.setValue([stamina, upperLimit]);
        this.diamond.setValue([bone]);
    }

    public setTitle(text) {
        this.title.skin = `images/component/text_${text}.png`;
    }
}
