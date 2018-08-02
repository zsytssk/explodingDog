import { ValueBar } from './valuebar';
import { PopupSetting } from '../popup/setting/pop';
import { PopupRank } from '../popup/popupRank';
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
        const { btn_setting, btn_rank } = this;
        btn_setting.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupSetting());
        });
        btn_rank.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupRank());
        });
    }

    public updateView({ bone, stamina, upperLimit }) {
        this.stamina.setValue([stamina, upperLimit]);
        this.diamond.setValue([bone]);
    }
}
