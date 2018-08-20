import { rankIcon } from "../hall/rankIcon";

export class popupRankChange extends Laya.Dialog {
    /**
     * 
     * @param danGrading 段位
     * @param isAdvance 是否升级段位
     */
    constructor(danGrading, isAdvance) {
        super();
        this.init(danGrading, isAdvance);
    }
    CONFIG = {
        closeOnSide: true
    }
    init(danGrading, isAdvance) {
        let icon = new rankIcon(danGrading);
        icon.scale(2, 2);
        let text = isAdvance ? '段位+1' : '段位-1';
        let label = new Laya.Label(text);
        label.fontSize = 46;
        label.font = 'sim hei';
        label.color = '#ffffff';
        label.pos(40, 240);
        this.addChildren(icon, label);
    }
}