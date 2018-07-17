import { cmd as base_cmd } from '../../../mcTree/event';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { tweenLoop, stopAni } from '../../../mcTree/utils/animate';
import {
    PlayerModel,
    cmd as player_cmd,
    PlayerStatus,
    ObserverActionInfo,
} from '../model/player';
import { tween } from '../../../mcTree/utils/animate';
import { CardModel } from '../model/card/card';
import { CardBoxCtrl } from './cardBox/cardBox';
import {
    logErr,
    queryClosest,
    getChildrenByName,
} from '../../../mcTree/utils/zutil';
import { GiveCardCtrl } from '../widget/giveCard';
import { CardCtrl } from './cardBox/card';

export interface Link {
    view: ui.game.seat.curSeatUI | ui.game.seat.otherSeatUI;
    empty_box: Laya.Sprite;
    active_box: Laya.Sprite;
    avatar: Laya.Image;
    die_avatar: Laya.Image;
    nickname: Laya.Text;
    give_card_ctrl: GiveCardCtrl;
    card_box_ctrl: CardBoxCtrl; // 是否加载了用户
    player_box: Laya.Sprite;
}

export class SeatCtrl extends BaseCtrl {
    public name = 'seat';
    protected link = {} as Link;
    protected model: PlayerModel;
    public action_info: ObserverActionInfo;
    public loadedPlayer = false; // 是否加载了用户
    constructor(view: any) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const view = this.link.view;
        const player_box = view.player_box;
        const empty_box = player_box.empty_box;
        const active_box = player_box.active_box;
        const avatar = player_box.avatar;
        const die_avatar = player_box.die_avatar;
        const nickname = player_box.nickname;
        const card_box = view.card_box;
        const card_box_ctrl = this.createCardBox(card_box);

        this.link = {
            ...this.link,
            active_box,
            avatar,
            card_box_ctrl,
            die_avatar,
            empty_box,
            nickname,
            player_box,
            view,
        };
    }
    protected createCardBox(card_box: Laya.Sprite): CardBoxCtrl {
        const card_box_ctrl = new CardBoxCtrl(card_box);
        this.addChild(card_box_ctrl);
        card_box_ctrl.init();
        return card_box_ctrl;
    }
    protected initEvent() {
        const { player_box } = this.link;

        /** 其他用户选中头像 */
        player_box.on(Laya.Event.CLICK, this, () => {
            const { action_info } = this;
            if (!action_info) {
                return;
            }
            const { status, action, observer } = action_info;
            if (action === 'choose_target' && status === 'act') {
                observer.next(this.model.user_id);
            }
        });
    }
    public loadPlayer(player: PlayerModel) {
        this.link.empty_box.visible = false;
        this.link.active_box.visible = true;
        this.link.avatar.skin = player.avatar;
        this.link.nickname.text = player.nickname;
        this.link.die_avatar.visible = false;

        this.model = player;
        this.loadedPlayer = true;
        this.bindModel();
    }
    private clearPlayer() {
        this.unBindModeEvent();
        this.model = undefined;
        this.loadedPlayer = false;
        this.link.empty_box.visible = true;
        this.link.active_box.visible = false;
        this.link.avatar.skin = '';
        this.link.nickname.text = '';
        this.link.die_avatar.visible = false;
    }
    private bindModel() {
        /** 渲染初始化的信息 */
        const player = this.model;
        const card_list = player.card_list;
        for (const card of card_list) {
            this.addCard(card);
        }

        this.onModel(base_cmd.destroy, this.clearPlayer.bind(this));
        this.onModel(player_cmd.add_card, (data: { card: CardModel }) => {
            this.addCard(data.card);
        });
        this.onModel(
            player_cmd.status_change,
            (data: { status: PlayerStatus }) => {
                this.setStatus(data.status);
            },
        );
        this.onModel(player_cmd.action, (data: ObserverActionInfo) => {
            this.beActioned(data);
        });
    }
    private unBindModeEvent() {
        this.offOtherEvent(this.model);
    }
    protected addCard(card: CardModel) {
        this.link.card_box_ctrl.addCard(card);
    }
    protected setStatus(status: PlayerStatus) {
        const { nickname: sprite } = this.link;
        if (status === 'speak') {
            const start_props = {
                scaleX: 1,
                scaleY: 1,
            };
            const end_props = {
                scaleX: 1.2,
                scaleY: 1.2,
            };
            tweenLoop({
                props_arr: [end_props, start_props],
                sprite,
                time: 1000,
            });
        } else {
            stopAni(sprite);
        }
    }
    /** 处理被action作用 */
    private beActioned(data: ObserverActionInfo) {
        const { nickname: sprite } = this.link;
        const { status, action, observer } = data;

        this.action_info = {
            action,
            observer,
            status,
        };
        /** 处理动作的完成 */
        if (status === 'complete') {
            stopAni(sprite);
            if (action === 'wait_get_card') {
                this.waitGiveCardComplete();
            }
            return;
        }

        /** 当前用户需要选择其他 才显示 */
        if (action === 'choose_target') {
            this.waitChoose();
        }
        /** 只有当前用户需要给牌才显示 */
        if (action === 'wait_get_card') {
            this.waitGiveCard();
        }
    }
    private waitChoose() {
        const { nickname: sprite } = this.link;
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
    }
    /** 等待给牌 */
    private waitGiveCard() {
        let { give_card_ctrl } = this.link;
        const { nickname: sprite } = this.link;
        const { observer } = this.action_info;
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
    public giveCard(card: CardCtrl) {
        const { give_card_ctrl } = this.link;
        give_card_ctrl.getCard(card);
    }
    public hideSeat() {
        this.link.view.visible = false;
    }

    public updatePos(position: any) {
        const view = this.link.view;
        tween({
            end_props: { top: position[0], centerX: position[1] },
            sprite: view,
            start_props: { top: view.top, centerX: view.centerX },
            time: 500,
        });
    }
}
