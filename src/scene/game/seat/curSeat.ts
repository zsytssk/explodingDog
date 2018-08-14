import { CMD } from '../../../data/cmd';
import { getChildrenByName, queryClosest } from '../../../mcTree/utils/zutil';
import { Type } from '../../popup/theFuture/popup';
import { theFuture } from '../../popup/theFuture/theFuture';
import { GameCtrl } from '../main';
import { CardModel } from '../model/card/card';
import {
    AddInfo,
    BlindStatus,
    cmd as player_cmd,
    ObserverActionInfo,
    PlayerModel,
} from '../model/player';
import { PopupDefuse } from '../widget/defuse';
import { CurCardCtrl } from './cardBox/curCard';
import { CurCardBoxCtrl, CurCardBoxUI } from './cardBox/curCardBox';
import { Link as BaseLink, SeatCtrl, SeatStatus } from './seat';

export interface Link extends BaseLink {
    view: ui.game.seat.curSeatUI;
    btn_chat: Laya.Button;
    card_box_ctrl: CurCardBoxCtrl;
    card_box_wrap: Laya.Sprite;
}

export const cmd = {
    add_card: player_cmd.add_card,
    status_change: player_cmd.status_change,
};

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
            const game_ctrl = queryClosest(this, 'name:game');
            game_ctrl.popChat();
        });
    }
    protected bindModel() {
        super.bindModel();
        this.onModel(player_cmd.blind_status, (data: BlindStatus) => {
            if (data.is_blind && data.play_ani) {
                this.link.card_box_ctrl.shuffle();
            }
        });
        this.onModel(player_cmd.pre_draw_card, (data: { card: CardModel }) => {
            this.preDrawCard(data.card);
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
        if (action === 'see_future' || action === 'alter_future') {
            this.theFuture(data);
        }
        if (action === 'show_defuse') {
            this.showDefuse(data);
        }
        if (action === 'show_set_explode') {
            this.showSetExplode();
        }
        if (action === 'finish_set_explode') {
            const popup = Sail.director.getDialogByName('popup_defuse');
            if (popup) {
                popup.defuseSuccess();
                popup.close();
            }
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
    /** 显示seeTheFuture and alterTheFuture功能 */
    private theFuture(action_data: ObserverActionInfo) {
        const { action, data, observer } = action_data;
        const card_list = data.topCards;
        theFuture(action as Type, card_list).subscribe(rdata => {
            if (action === 'alter_future') {
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
        const popup_defuse = Sail.director.getDialogByName('popup_defuse');
        if (!popup_defuse) {
            return;
        }
        popup_defuse.defuseSuccess();
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
    /** 当前用户说话时 需要将牌堆激活, 可以拿牌 */
    protected setStatus(status: SeatStatus) {
        const { card_heap_ctrl } = this.link;
        if (status === 'speak') {
            card_heap_ctrl.activeTake();
        } else {
            card_heap_ctrl.disableTake();
        }
        super.setStatus(status);
    }
    /** 手牌中是否有某张牌 */
    public haveCard(card_id: string): boolean {
        let result = false;
        this.model.card_list.forEach(item => {
            if (item.card_id === card_id + '') {
                result = true;
            }
        });
        return result;
    }
    private preDrawCard(card: CardModel) {
        const card_id = card.card_id;
        const { status } = this.model;
        if (status === 'speak') {
            Sail.io.emit(CMD.HIT, {
                hitCard: card_id,
            });
        }
        if (status === 'wait_give') {
            const { give_card_ctrl } = this.link;
            give_card_ctrl.preGetCard(card_id);
        }
    }
}
