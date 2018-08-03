export class GuideStart extends ui.guide.startGuideUI {
    constructor() {
        super();
    }
    setType(param) {
        if (param == 'start') {
            this.start.visible = true;
            this.end.visible = false;
        } else {
            this.start.visible = false;
            this.end.visible = true;
        }
    }
}