import { ValueBar } from './valuebar';
import { PopupSetting } from '../popup/setting/pop';
import { PopupRank } from '../popup/popupRank';
import { PopupGetFood } from '../popup/popupGetFood';
import { PopupAvatar } from '../popup/popupAvatar';
import { PopupCharge } from '../popup/popupCharge';
import { PopupShop } from '../popup/popupShop';
export class TopBar extends ui.hall.topbarUI {
    public stamina: ValueBar;
    public diamond: ValueBar;
    constructor() {
        super();
        this.init();
    }
    private init() {
        this.stamina.setType('stamina');
        this.diamond.setType('diamond');

        this.initEvent();
    }
    private initEvent() {
        const { btn_setting, btn_rank, btn_get_food, btn_home, diamond, stamina } = this;
        btn_setting.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupSetting());
        });
        btn_rank.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupRank());
        });
        btn_get_food.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupGetFood());
        });
        stamina.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupShop());
        });
        diamond.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupCharge());
        });
        // test
        btn_home.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupAvatar());
        });
    }

    public updateView({ bone, stamina, upperLimit }) {
        this.stamina.setValue([stamina, upperLimit]);
        this.diamond.setValue([bone]);
    }
}
