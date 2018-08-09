import { CMD } from '../../data/cmd';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { PopupCards } from '../popup/popupCards';
import { CardType } from './model/game';
import {
    shareToWx,
    hasShareToWx,
    browserSupportCopy,
    copy,
} from '../../utils/tool';
interface Link {
    view: ui.game.hostZone.mainUI;
    card_type: Laya.ViewStack;
    choose_card_btn: Laya.Box;
    btn_share: Laya.Button;
    btn_copy: Laya.Button;
    start_btn: Laya.Box;
    room_id_text: Laya.Text;
}
export class HostZoneCtrl extends BaseCtrl {
    protected link = {} as Link;
    private is_disabled = false;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const { view } = this.link;
        const choose_card_btn = view.card_type.choose_card_btn;
        const card_type = view.card_type.card_type;
        const start_btn = view.start.start_btn;
        const btn_share = view.billboard.btn_share;
        const btn_copy = view.billboard.btn_copy;
        const room_id_text = view.billboard.room_id;

        this.link = {
            ...this.link,
            btn_copy,
            btn_share,
            card_type,
            choose_card_btn,
            room_id_text,
            start_btn,
        };

        if (hasShareToWx()) {
            btn_share.visible = true;
        } else if (browserSupportCopy) {
            btn_copy.visible = true;
        }
    }
    protected initEvent() {
        const { choose_card_btn, start_btn, btn_share, btn_copy } = this.link;
        choose_card_btn.on(Laya.Event.CLICK, this, () => {
            if (this.is_disabled) {
                return;
            }
            const popupCards = new PopupCards();
            popupCards.setType('choose');
            popupCards.popupEffect = null;
            popupCards.closeEffect = null;
            Sail.director.popScene(popupCards);
        });

        start_btn.on(Laya.Event.CLICK, this, () => {
            if (this.is_disabled) {
                return;
            }
            Sail.io.emit(CMD.GAME_START);
        });
        btn_share.on(Laya.Event.CLICK, this, () => {
            shareToWx('炸弹狗', '哈哈哈', '', location.href);
        });
        btn_copy.on(Laya.Event.CLICK, this, () => {
            copy(location.href);
        });
    }
    public show(room_id: string, is_cur_create: boolean) {
        const { view, room_id_text } = this.link;
        view.visible = true;
        /** 设置roomId */
        room_id_text.text = room_id;
        /** 非当前用户禁用。。 */
        if (!is_cur_create) {
            this.disable();
        }
    }
    public hide() {
        this.link.view.visible = false;
    }
    public disable() {
        const { choose_card_btn, start_btn } = this.link;

        choose_card_btn.disabled = true;
        start_btn.disabled = true;
        [choose_card_btn, start_btn].forEach(item => {
            (item.getChildAt(0) as Laya.Clip).index = 1;
        });
    }
    public enable() {
        const { choose_card_btn, start_btn } = this.link;

        choose_card_btn.disabled = false;
        start_btn.disabled = false;
        [choose_card_btn, start_btn].forEach(item => {
            (item.getChildAt(0) as Laya.Clip).index = 0;
        });
    }
    /** 设置牌类型ui */
    public setCardType(type: CardType) {
        if (!type) {
            return;
        }
        const { card_type } = this.link;
        const type_num = type - 1;
        card_type.selectedIndex = Number(type_num);
    }
}
