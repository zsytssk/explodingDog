import { BaseCtrl } from '../../mcTmpl/ctrl/base';
import { PopupCards } from '../popup/popupCards'
interface Link {
    view: Laya.Sprite;
    chooseCardBtn: Laya.Sprite;
}


/**  */
export class HostZoneCtrl extends BaseCtrl {
    protected link = {} as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const view = this.link.view as any;
        this.link.chooseCardBtn = view.cardType.chooseCardBtn;
    }
    protected initEvent() {
        this.link.chooseCardBtn.on(Laya.Event.CLICK, this, () => {
            let popupCards = new PopupCards();
            popupCards.setType('choose');
            popupCards.popupEffect = null;
            popupCards.closeEffect = null;
            Sail.director.popScene(popupCards);
        });
    }
    public show() {
        this.link.view.visible = true;
    }
    public hide() {
        this.link.view.visible = false;
    }
}
