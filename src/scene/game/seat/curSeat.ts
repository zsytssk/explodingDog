import {
    getChildrenByName,
    log,
    queryClosest,
} from '../../../mcTree/utils/zutil';
import { Type } from '../../popup/theFuture/popup';
import { theFuture } from '../../popup/theFuture/theFuture';
import {
    ObserverActionInfo,
    PlayerModel,
    cmd as player_cmd,
    BlindStatus,
} from '../model/player';
import { PopupDefuse } from '../widget/defuse';
import { CurCardBoxCtrl, CurCardBoxUI } from './cardBox/curCardBox';
import { Link as BaseLink, SeatCtrl } from './seat';
import { GiveCardCtrl } from '../widget/giveCard';
import { GameCtrl } from '../main';

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

        const game_ctrl = queryClosest(this, 'name:game');
        const give_card_ctrl = getChildrenByName(game_ctrl, 'give_card')[0];

        this.link = {
            ...this.link,
            btn_chat,
            card_box_wrap,
            give_card_ctrl,
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
    protected bindModel() {
        super.bindModel();
        this.onModel(player_cmd.blind_status, (data: BlindStatus) => {
            this.link.card_box_ctrl.shuffle();
        });
    }
    protected createCardBox(card_box: CurCardBoxUI) {
        const card_box_ctrl = new CurCardBoxCtrl(card_box);
        this.addChild(card_box_ctrl);
        card_box_ctrl.init();
        return card_box_ctrl;
    }
    /** 处理被action作用 */
    protected beActioned(data: ObserverActionInfo) {
        super.beActioned(data);

        const { status, action } = data;

        /** 处理动作的完成 */
        if (status === 'complete') {
            if (action === 'wait_get_card') {
                this.waitGiveCardComplete();
            }
            if (action === 'show_set_explode') {
                this.hideSetExplode();
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
        const { give_card_ctrl } = this.link;
        const { observer } = action_data;
        give_card_ctrl.show().then(card_id => {
            observer.next(card_id);
        });
    }
    private waitGiveCardComplete() {
        const { give_card_ctrl } = this.link;
        if (give_card_ctrl) {
            give_card_ctrl.reset();
        }
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
        popupDefuse.setCards(player.card_list, this);
        Sail.director.popScene(popupDefuse);
    }
    /**
     * 将将牌池放置到特定的节点上， 炸弹出现时 弹出层需要借用这ctrl
     * @param wrap card_box 要放置的地方
     * @param card_move_box 牌在移动时要放置的地方
     */
    public putCardBoxInWrap(wrap: Laya.Sprite, card_move_box: Laya.Sprite) {
        const { card_box_ctrl } = this.link;
        return card_box_ctrl.putCardBoxInWrap(wrap, card_move_box);
    }
    /** 借用牌池结束后还原到原来节点中 */
    public putCardBoxBack() {
        const { card_box_ctrl, card_box_wrap } = this.link;
        const game_ctrl = queryClosest(this, 'name:game') as GameCtrl;
        const widget_box = game_ctrl.getWidgetBox();
        return card_box_ctrl.putCardBoxInWrap(card_box_wrap, widget_box);
    }
    private showSetExplode() {
        const game_ctrl = queryClosest(this, 'name:game');
        const popupDefuse = Sail.director.getDialogByName('popup_defuse');
        if (popupDefuse) {
            popupDefuse.defuseSuccess();
        }
        Laya.timer.once(1000, this, () => {
            Sail.director.closeByName('popup_defuse');
            const explode_pos_ctrl = getChildrenByName(
                game_ctrl,
                'explode_pos_ctrl',
            )[0];
            explode_pos_ctrl.showView();
        });
    }
    private hideSetExplode() {
        const game_ctrl = queryClosest(this, 'name:game');
        const explode_pos_ctrl = getChildrenByName(
            game_ctrl,
            'explode_pos_ctrl',
        )[0];
        explode_pos_ctrl.hideView();
    }
    /**手牌中是否有某张牌 */
    public haveCard(cardId: string): boolean {
        let result = false;
        this.model.card_list.forEach(item => {
            if (item.card_id == cardId) {
                result = true;
            }
        });
        return result;
    }
}
