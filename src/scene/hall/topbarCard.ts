import { ValueBar } from './valuebar';
import { PopupSetting } from '../popup/setting/pop';
import { CMD } from '../../data/cmd';
export class TopBar extends ui.hall.topbarCardUI {
    public stamina: ValueBar;
    public diamond: ValueBar;
    constructor() {
        super();
        this.init();
    }
    init() {
        (this.stamina as ValueBar).setType('stamina');
        this.diamond.setType('diamond');
        this.initEvent();
        Sail.io.register(CMD.GET_USER_AMOUNT, this, this.updateView);
        Sail.io.emit(CMD.GET_USER_AMOUNT);
    }
    private initEvent() {
        const { btnSetting } = this;
        btnSetting.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupSetting());
        });
    }

    updateView({ bone, stamina, upperLimit }) {
        this.stamina.setValue([stamina, upperLimit]);
        this.diamond.setValue([bone]);
    }

    setTitle(text) {
        this.title.skin = `images/component/text_${text}.png`;
    }
}
