import { TopBar } from '../hall/topbarCard';

export class PopupHelp extends ui.popup.popupHelpUI {
    private topbar: TopBar;
    constructor() {
        super();
        this.init();
    }
    private init() {
        this.name = 'popupCards';
        this.topbar = new TopBar();
        this.topbar.top = 20;
        this.addChild(this.topbar);
    }

    private initEvent() {}
}
