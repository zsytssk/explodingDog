import { Observable, Subscriber } from 'rxjs';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { cmd as base_cmd } from '../../../mcTree/event';
import {
    scale_in,
    scale_out,
    stopAni,
    tween,
    tweenLoop,
} from '../../../mcTree/utils/animate';
import {
    getChildrenByName,
    queryClosest,
    ellipsisStr,
} from '../../../mcTree/utils/zutil';
import { getAvatar, getSoundPath } from '../../../utils/tool';
import { CardModel } from '../model/card/card';
import {
    AddInfo,
    cmd as player_cmd,
    ObserverActionInfo,
    PlayerModel,
    PlayerStatus,
    BlindStatus,
} from '../model/player';
import { GiveCardCtrl } from '../widget/giveCard';
import { SlapCtrl, SlapType } from '../widget/slap';
import { CardBoxCtrl } from './cardBox/cardBox';
import { CardHeapCtrl } from '../cardHeap/main';

export type SeatStatus = 'exploding' | 'load_player' | 'clear' | PlayerStatus;

export interface Link {
    view: ui.game.seat.curSeatUI | ui.game.seat.otherSeatUI;
    empty_box: Laya.Sprite;
    active_box: Laya.Sprite;
    avatar: Laya.Image;
    die_avatar: Laya.Image;
    nickname: Laya.Text;
    card_box_ctrl: CardBoxCtrl; // 是否加载了用户
    slap_ctrl: SlapCtrl; // 是否加载了用户
    player_box: Laya.Sprite;
    highlight: Laya.Sprite;
    chat_box: Laya.Sprite;
    chat_label: Laya.Label;
    give_card_ctrl: GiveCardCtrl;
    card_heap_ctrl: CardHeapCtrl;
    icon_creator: Laya.Image;
}

export class SeatCtrl extends BaseCtrl {
    public name = 'seat';
    protected link = {} as Link;
    protected model: PlayerModel;
    /**  是否加载了用户 */
    public loadedPlayer = false;
    private wait_choose_observer: Subscriber<string>;
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
        const highlight = player_box.highlight;
        const active_box = player_box.active_box;
        const avatar = player_box.avatar;
        const die_avatar = player_box.die_avatar;
        const nickname = player_box.nickname;
        const card_box = view.card_box;
        const chat_box = view.chatBox;
        const chat_label = view.chatLabel;
        const icon_creator = player_box.icon_creator;
        const card_box_ctrl = this.createCardBox(card_box);

        const game_ctrl = queryClosest(this, 'name:game');
        const give_card_ctrl = getChildrenByName(game_ctrl, 'give_card')[0];
        const card_heap_ctrl = getChildrenByName(game_ctrl, 'card_heap')[0];

        this.link = {
            ...this.link,
            active_box,
            avatar,
            card_box_ctrl,
            card_heap_ctrl,
            chat_box,
            chat_label,
            die_avatar,
            empty_box,
            give_card_ctrl,
            highlight,
            nickname,
            player_box,
            icon_creator,
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
            const { wait_choose_observer } = this;
            if (!wait_choose_observer) {
                return;
            }
            wait_choose_observer.next(this.model.user_id);
        });
    }
    public loadPlayer(player: PlayerModel) {
        /** 设置默认状态 */
        this.model = player;
        this.setStatus('load_player');
        this.setStatus(player.status);

        this.loadedPlayer = true;
        this.bindModel();
    }
    private clearPlayer() {
        const { card_box_ctrl } = this.link;
        this.hideExplode();
        this.loadedPlayer = false;
        this.setStatus('clear');
        this.offModel();
        this.model = undefined;
        card_box_ctrl.clearCards();
    }
    protected bindModel() {
        /** 渲染初始化的信息 */
        const player = this.model;
        const card_list = player.card_list;
        this.link.card_box_ctrl.addCards(card_list);

        this.onModel(base_cmd.destroy, this.clearPlayer.bind(this));

        this.onModel(player_cmd.blind_status, (data: BlindStatus) => {
            if (data.is_blind && data.play_ani) {
                this.shuffle();
            }
        });

        this.onModel(player_cmd.remove_cards, () => {
            this.link.card_box_ctrl.clearCards();
        });
        this.onModel(player_cmd.add_card, (data: AddInfo) => {
            this.addCard(data);
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

        this.onModel(player_cmd.draw_card, (data: { card: CardModel }) => {
            this.drawCard(data.card);
        });
        this.onModel(player_cmd.creator_change, (data: { isCreator: boolean }) => {
            this.setCreator(data.isCreator);
        })
    }
    public setCreator(isCreator: boolean) {
        this.link.icon_creator.visible = isCreator;
    }
    protected setStatus(status: SeatStatus) {
        const {
            empty_box,
            active_box,
            avatar,
            die_avatar,
            highlight,
            nickname,
        } = this.link;
        switch (status) {
            case 'load_player':
                const { model } = this;
                empty_box.visible = false;
                active_box.visible = true;
                die_avatar.visible = false;
                avatar.visible = true;
                avatar.skin = getAvatar(model.avatar);
                nickname.text = ellipsisStr(model.nickname, 18, '..');
                break;
            case 'speak':
                const start_props = {
                    alpha: 0.2,
                    scaleX: 0.67,
                    scaleY: 0.67,
                };
                const end_props = {
                    alpha: 0.7,
                    scaleX: 1,
                    scaleY: 1,
                };
                highlight.visible = true;
                this.hideExplode();
                break;
            case 'die':
                empty_box.visible = false;
                active_box.visible = true;
                die_avatar.visible = true;
                highlight.visible = false;
                avatar.visible = false;
                this.hideExplode();
                break;
            case 'clear':
                empty_box.visible = true;
                active_box.visible = true;
                highlight.visible = false;
                avatar.skin = '';
                nickname.text = '';
                die_avatar.visible = false;
                this.hideExplode();
                break;
            case 'exploding':
                this.showExplode();
                break;
            default:
                highlight.visible = false;
        }
    }
    protected shuffle() { }
    /** 处理被action作用 */
    protected beActioned(data: ObserverActionInfo) {
        const { status, action } = data;

        /** 处理动作的完成 */
        if (status === 'complete') {
            if (action === 'choose_target') {
                this.beChoosed();
            }
            return;
        }

        /** 当前用户需要选择其他 才显示 */
        if (action === 'choose_target') {
            this.waitBeChoose(data);
        }
        /** 当前用户需要选择其他 才显示 */
        if (action === 'slap') {
            this.slap(data);
        }
        if (action === 'reverse_arrows') {
            this.reverseArrows(data);
        }
        if (action === 'show_defuse') {
            this.setStatus('exploding');
        }
        if (action === 'show_set_explode') {
            Laya.SoundManager.stopSound(getSoundPath('bomb1'));
            this.setStatus('speak');
        }
        if (action === 'finish_set_explode') {
            this.setStatus('speak');
        }
    }

    // 显示头像炸弹
    private showExplode() {
        const ani = new Laya.Skeleton();
        ani.load(
            'animation/touxiangzhadan.sk',
            new Laya.Handler(this, () => {
                ani.name = 'ani_explode';
                ani.pos(75, 75);
                ani.play(0, true);
                this.link.player_box.addChild(ani);
            }),
        );
    }
    // 销毁头像炸弹
    private hideExplode() {
        const ani = this.link.player_box.getChildByName('ani_explode');
        if (ani) {
            ani.destroy();
        }
    }

    private reverseArrows(action_data) {
        const game_ctrl = queryClosest(this, 'name:game');
        game_ctrl
            .getChildByName('turn_arrow_ctrl')
            .rotate(action_data.data.turnDirection);
    }
    /** 等待被选择 */
    private waitBeChoose(action_data: ObserverActionInfo) {
        const { observer: action_observer } = action_data;
        const { arrow } = this.link.view as ui.game.seat.otherSeatUI;

        arrow.visible = true;
        new Observable(observer => {
            const start_props = {
                y: 176,
            };
            const end_props = {
                y: 200,
            };
            tweenLoop({
                props_arr: [end_props, start_props],
                sprite: arrow,
                time: 1000,
            });
            this.wait_choose_observer = observer;
        }).subscribe((user_id: string) => {
            action_observer.next(user_id);
        });
    }
    private beChoosed() {
        const { arrow } = this.link.view as ui.game.seat.otherSeatUI;
        this.wait_choose_observer = undefined;
        stopAni(arrow);
        arrow.visible = false;
    }
    private slap(action_data: ObserverActionInfo) {
        let { slap_ctrl } = this.link;
        const { target, count } = action_data.data;

        let type = 'slap_other' as SlapType;
        if (target.is_cur_player) {
            type = 'slap_self';
        }

        if (!slap_ctrl) {
            const game_ctrl = queryClosest(this, 'name:game');
            slap_ctrl = getChildrenByName(game_ctrl, 'slap')[0];
            this.link.slap_ctrl = slap_ctrl;
        }
        slap_ctrl.slap(type, this, count);
    }
    public hideSeat() {
        this.link.view.visible = false;
    }
    public showSeat() {
        this.link.view.visible = true;
    }
    /** 获得座位底部的坐标 用来slap */
    public getSeatPos() {
        const { view } = this.link;
        const { width, height } = view;
        const pos = new Laya.Point(width / 2, height / 2);
        view.localToGlobal(pos);
        return pos;
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

    public showChat(msg) {
        const { chat_box, chat_label } = this.link;
        chat_box.clearTimer(this, hide);
        chat_label.text = msg;
        chat_box.width = 100 + chat_label.width;
        chat_box.visible = true;
        scale_in(chat_box, 100, 'backOut');
        chat_box.timerOnce(3000, this, hide);

        function hide() {
            scale_out(chat_box, 100);
        }
    }
    /** 添加牌, 当前用户多一个牌从CardHeep飞到用户身上的动画 */
    protected addCard(data: AddInfo) {
        const { from } = data;
        const { give_card_ctrl, card_heap_ctrl } = this.link;
        const card = this.link.card_box_ctrl.addCard(data.card, data.from);
        if (from === 'take') {
            card_heap_ctrl.setCardFace(card);
            return;
        }
        if (from === 'give') {
            give_card_ctrl.setCardFace(card);
            return;
        }
    }
    public moveByModel(card_model: CardModel) {
        const { card_box_ctrl } = this.link;
        const card_ctrl = card_box_ctrl.moveByModel(card_model);
        return card_ctrl;
    }
    /** 打出牌 到牌堆或者给其他玩家 */
    private drawCard(card_model: CardModel) {
        const { give_card_ctrl } = this.link;
        const { status } = this.model;
        /* 出牌的逻辑全部在game里面处理了 */
        if (status === 'speak') {
            return;
        }
        const card_ctrl = this.moveByModel(card_model);
        give_card_ctrl.getCard(card_ctrl);
    }
}
