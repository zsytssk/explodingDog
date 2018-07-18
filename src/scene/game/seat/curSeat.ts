import {
    getChildrenByName,
    log,
    queryClosest,
} from '../../../mcTree/utils/zutil';
import { Type } from '../../popup/theFuture/popup';
import { theFuture } from '../../popup/theFuture/theFuture';
import { CardModel } from '../model/card/card';
import { ObserverActionInfo, PlayerModel } from '../model/player';
import { PopupDefuse } from '../widget/defuse';
import { CardCtrl } from './cardBox/card';
import { CurCardBoxCtrl, CurCardBoxUI } from './cardBox/curCardBox';
import { Link as BaseLink, SeatCtrl } from './seat';
import { tweenLoop } from '../../../mcTree/utils/animate';
import { GiveCardCtrl } from '../widget/giveCard';

export interface Link extends BaseLink {
    view: ui.game.seat.curSeatUI;
    btn_chat: Laya.Button;
    card_box_ctrl: CurCardBoxCtrl;
    give_card_ctrl: GiveCardCtrl;
    card_box_wrap: Laya.Sprite;
}

export class CurSeatCtrl extends SeatCtrl {
    protected link: Link;
    public model: PlayerModel;
    constructor(view: ui.game.seat.curSeatUI) {
        super(view);
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        super.initLink();
        const view = this.link.view;
        const { player_box, btn_chat, card_box_wrap } = view;
        this.link.player_box = player_box;
        this.link.btn_chat = btn_chat;

        this.link = {
            ...this.link,
            btn_chat,
            card_box_wrap,
            player_box,
        };
    }
    protected initEvent() {
        super.initEvent();
        const btn_chat = this.link.btn_chat;
        btn_chat.on(Laya.Event.CLICK, this, () => {
            log('chat');
        });
    }
    protected createCardBox(card_box: CurCardBoxUI) {
        const card_box_ctrl = new CurCardBoxCtrl(card_box);
        this.addChild(card_box_ctrl);
        card_box_ctrl.init();
        return card_box_ctrl;
    }
    protected addCard(card: CardModel) {
        this.link.card_box_ctrl.addCard(card);
    }
    /** 处理被action作用 */
    protected beActioned(data: ObserverActionInfo) {
        super.beActioned(data);

        const { nickname: sprite } = this.link;
        const { status, action } = data;

        /** 处理动作的完成 */
        if (status === 'complete') {
            if (action === 'wait_get_card') {
                this.waitGiveCardComplete();
            }
            return;
        }

        /** 只有当前用户需要给牌才显示 */
        if (action === 'wait_get_card') {
            this.waitGiveCard(data);
        }
        /** 只有当前用户需要给牌才显示 */
        if (action === 'see_the_future' || action === 'alter_the_future') {
            this.theFuture(data);
        }
        if (action === 'show_defuse') {
            this.showDefuse(data);
        }
        if (action === 'show_set_explode') {
            this.showSetExplode();
        }
    }
    /** 等待给牌 */
    private waitGiveCard(action_data: ObserverActionInfo) {
        let { give_card_ctrl } = this.link;
        const { nickname: sprite } = this.link;
        const { observer } = action_data;
        const start_props = {
            rotation: 0,
        };
        const end_props = {
            rotation: 360,
        };
        tweenLoop({
            props_arr: [end_props, start_props],
            sprite,
            time: 1000,
        });
        if (!give_card_ctrl) {
            const game_ctrl = queryClosest(this, 'name:game');
            give_card_ctrl = getChildrenByName(game_ctrl, 'give_card')[0];
            this.link.give_card_ctrl = give_card_ctrl;
        }
        give_card_ctrl.show().then(card_id => {
            observer.next(card_id);
        });
    }
    private waitGiveCardComplete() {
        const { give_card_ctrl } = this.link;
        give_card_ctrl.hide();
    }
    private theFuture(action_data: ObserverActionInfo) {
        const { action, data, observer } = action_data;
        const card_list = data.topCards;
        theFuture(action as Type, card_list).subscribe(rdata => {
            if (action === 'alter_the_future') {
                observer.next(rdata);
            }
        });
    }
    private showDefuse(data: ObserverActionInfo) {
        const popupDefuse = new PopupDefuse(data.data.remainTime);
        const player = this.model;
        const { card_box_ctrl } = this.link;
        popupDefuse.setCards(player.card_list, card_box_ctrl);
        Sail.director.popScene(popupDefuse);
    }
    public putCardBoxInWrap(wrap: Laya.Sprite) {
        const { card_box_ctrl } = this.link;
        return card_box_ctrl.putCardBoxInWrap(wrap);
    }
    public putCardBoxBack() {
        const { card_box_ctrl, card_box_wrap } = this.link;
        return card_box_ctrl.putCardBoxInWrap(card_box_wrap);
    }
    public giveCard(card: CardCtrl) {
        const { give_card_ctrl } = this.link;
        give_card_ctrl.getCard(card);
    }
    private showSetExplode() {
        const game_ctrl = queryClosest(this, 'name:game');
        let popupDefuse = Sail.director.getDialogByName('popup_defuse');
        if (popupDefuse) {
            popupDefuse.defuseSuccess();
        }
        Laya.timer.once(1000, this, () => {
            Sail.director.closeByName('popup_defuse');
            let explode_pos_ctrl = getChildrenByName(game_ctrl, 'give_card')[0];
            explode_pos_ctrl.show();
        });
    }
}
