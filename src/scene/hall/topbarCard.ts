import { ValueBar } from './valuebar';

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
    }

    updateView({ bone, stamina, upperLimit }) {
        this.stamina.setValue([stamina, upperLimit]);
        this.diamond.setValue([bone]);
    }

    setTitle(text) {
        this.title.skin = `images/component/cardType/text_${text}.png`;

    }
}
