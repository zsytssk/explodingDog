export class TopBar extends ui.hall.topbarCardUI {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.stamina.setType('stamina');
        this.diamond.setType('diamond');
    }

    updateView({ bone, stamina, upperLimit }) {
        this.stamina.setValue([stamina, upperLimit]);
        this.diamond.setValue([bone]);
    }

    setTitle(text) {
        this.title.skin = `images/cards/text_${text}.png`;
    }
}
