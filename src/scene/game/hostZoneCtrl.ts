import { CONFIG } from './../../data/config';
import { CMD } from '../../data/cmd';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { PopupCards } from '../popup/popupCards';
import { CardType } from './model/game';
import {
    shareToWx,
    hasShareToWx,
    browserSupportCopy,
    copy,
    getShareUrl,
    isWeixin,
} from '../../utils/tool';
import { scale_in, slide_left_in } from '../../mcTree/utils/animate';
import { PopupTip } from '../popup/popupTip';
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
        const start_btn = view.start_btn;
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

        if (hasShareToWx() || isWeixin()) {
            btn_share.visible = true;
        } else if (browserSupportCopy()) {
            btn_copy.visible = true;
        }
    }
    protected initEvent() {
        const {
            choose_card_btn,
            start_btn,
            btn_share,
            btn_copy,
            room_id_text,
        } = this.link;
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
            Sail.io.emit(CMD.GAME_START);
        });
        btn_share.on(Laya.Event.CLICK, this, () => {
            if (isWeixin()) {
                //弹出微信分享提示
                let popup = new ui.popup.popupWxShareUI();
                popup.right = 100;
                popup.once(Laya.Event.CLICK, this, () => {
                    popup.close();
                });
                Sail.director.popScene(popup, { closeOnSide: true });
                return;
            }
            //1768调微信分享
            let msg = CONFIG.room_msg.replace('******', room_id_text.text);
            shareToWx(
                1,
                CONFIG.room_title,
                msg,
                CONFIG.share_icon,
                `${getShareUrl()}&room_id=${room_id_text.text}`,
            );
        });
        btn_copy.on(Laya.Event.CLICK, this, () => {
            copy(`${getShareUrl()}&room_id=${room_id_text.text}`).then(() => {
                Sail.director.popScene(new PopupTip('已复制房间号，\n请粘贴给好友。'));
            });
        });
    }
    public async show(room_id: string, is_cur_create: boolean) {
        const { view, room_id_text } = this.link;
        const { card_type, start_btn, billboard } = view;
        view.visible = true;
        /** 设置roomId */
        room_id_text.text = room_id;
        /** 非当前用户禁用。。 */
        if (!is_cur_create) {
            this.disable();
        }
        card_type.visible = billboard.visible = false;
        await slide_left_in(card_type);
        await slide_left_in(billboard);
    }
    public hide() {
        const { view } = this.link;
        view.visible = false;
    }
    public disable() {
        const { choose_card_btn, start_btn } = this.link;

        choose_card_btn.disabled = true;
        start_btn.visible = false;
    }
    public enable() {
        const { choose_card_btn, start_btn } = this.link;

        choose_card_btn.disabled = false;
        start_btn.visible = true;
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
