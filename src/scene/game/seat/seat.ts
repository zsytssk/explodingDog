import { Observable, Subscriber } from 'rxjs';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { cmd as base_cmd } from '../../../mcTree/event';
import { stopAni, tween, tweenLoop } from '../../../mcTree/utils/animate';
import { CardModel } from '../model/card/card';
import {
    cmd as player_cmd,
    ObserverActionInfo,
    PlayerModel,
    PlayerStatus,
} from '../model/player';
import { CardBoxCtrl } from './cardBox/cardBox';
import { SlapCtrl, SlapType } from '../widget/slap';
import { queryClosest, getChildrenByName } from '../../../mcTree/utils/zutil';

type SeatStatus = 'load_player' | 'clear' | PlayerStatus;

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
        const card_box_ctrl = this.createCardBox(card_box);

        this.link = {
            ...this.link,
            active_box,
            avatar,
            card_box_ctrl,
            die_avatar,
            empty_box,
            highlight,
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

        this.loadedPlayer = false;
        this.setStatus('clear');
        this.offModel();
        this.model = undefined;
        card_box_ctrl.clearCards();
    }
    private bindModel() {
        /** 渲染初始化的信息 */
        const player = this.model;
        const card_list = player.card_list;
        this.link.card_box_ctrl.addCards(card_list);

        this.onModel(base_cmd.destroy, this.clearPlayer.bind(this));
        this.onModel(player_cmd.add_card, (data: { card: CardModel }) => {
            this.link.card_box_ctrl.addCard(data.card, true);
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
                avatar.skin = model.avatar;
                nickname.text = model.nickname;
                break;
            case 'speak':
                const start_props = {
                    alpha: 0.6,
                    scaleX: 0.8,
                    scaleY: 0.8,
                };
                const end_props = {
                    alpha: 0.5,
                    scaleX: 0.9,
                    scaleY: 0.9,
                };
                highlight.visible = true;
                tweenLoop({
                    props_arr: [end_props, start_props],
                    sprite: highlight,
                    time: 1000,
                });
                break;
            case 'die':
                empty_box.visible = true;
                active_box.visible = true;
                die_avatar.visible = true;
                highlight.visible = false;
                avatar.visible = false;
                break;
            case 'clear':
                empty_box.visible = true;
                active_box.visible = true;
                highlight.visible = false;
                avatar.skin = '';
                nickname.text = '';
                die_avatar.visible = false;
                break;
            default:
                highlight.visible = false;
        }
    }
    /** 处理被action作用 */
    protected beActioned(data: ObserverActionInfo) {
        const { nickname: sprite } = this.link;
        const { status, action } = data;

        /** 处理动作的完成 */
        if (status === 'complete') {
            stopAni(sprite);
            if (action === 'show_set_explode') {
                // data.data.
                const game_ctrl = queryClosest(this, 'name:game');
                game_ctrl
                    .getChildByName('docker_ctrl')
                    .setRate(data.data.bombProb);
                game_ctrl
                    .getChildByName('card_heap_ctrl')
                    .setRemainCard(data.data.remainCard);
            }
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
            this.reverseArrows();
        }
    }

    private reverseArrows() {
        const game_ctrl = queryClosest(this, 'name:game');
        game_ctrl.getChildByName('turn_arrow_ctrl').rotate();
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
    public showSeat(){
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
}
