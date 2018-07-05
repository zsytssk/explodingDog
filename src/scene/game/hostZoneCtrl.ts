import { BaseCtrl } from '../../mcTmpl/ctrl/base';
import { PopupCards } from '../popup/popupCards';
import { CMD } from '../../data/cmd';
import { card_type_map, getKeyByValue, CardType } from './model/game';
import { log } from '../../mcTmpl/utils/zutil';
interface Link {
    view: Laya.Sprite;
    card_type: Laya.ViewStack;
    choose_card_btn: Laya.Sprite;
    start_btn: Laya.Sprite;
    room_id_text: Laya.Text;
}

/**  */
export class HostZoneCtrl extends BaseCtrl {
    protected link = {} as Link;
    private actions = {} as SailIoAction;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const view = this.link.view as ui.game.hostZone.mainUI;
        this.link.choose_card_btn = view.card_type.choose_card_btn;
        this.link.card_type = view.card_type.card_type;
        this.link.start_btn = view.start.start_btn;
        this.link.room_id_text = view.billboard.room_id;
    }
    protected initEvent() {
        const { choose_card_btn, start_btn } = this.link;
        choose_card_btn.on(Laya.Event.CLICK, this, () => {
            const popupCards = new PopupCards();
            popupCards.setType('choose');
            popupCards.popupEffect = null;
            popupCards.closeEffect = null;
            Sail.director.popScene(popupCards);
        });

        start_btn.on(Laya.Event.CLICK, this, () => {
            log('开始游戏');
        });
    }
    public show(room_id: string, card_type: number) {
        const { view, room_id_text } = this.link;
        view.visible = true;
        /** 设置roomId */
        room_id_text.text = room_id;
    }
    public hide() {
        this.link.view.visible = false;
    }
    /** 设置牌类型ui */
    public setCardType(type: CardType) {
        const { card_type } = this.link;
        const type_num = getKeyByValue(card_type_map, type);
        if (!type_num) {
            return;
        }
        card_type.selectedIndex = type_num;
    }
}
