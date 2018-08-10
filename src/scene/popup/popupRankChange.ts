import { rankIcon } from "../hall/rankIcon";

export class popupRankChange extends Laya.Dialog {
    constructor(danGrading) {
        super();
        this.init(danGrading);
    }
    CONFIG = {
        closeOnSide: true
    }
    init(danGrading) {
        let icon = new rankIcon(danGrading);
        icon.scale(2, 2);
        let label = new Laya.Label('段位+1');
        label.fontSize = 46;
        label.font = 'sim hei';
        label.color = '#ffffff';
        label.pos(40, 240);
        this.addChildren(icon, label);
    }
}