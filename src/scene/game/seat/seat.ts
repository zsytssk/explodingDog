import { cmd as base_cmd } from '../../../mcTree/event';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { PlayerModel, cmd as player_cmd } from '../model/player';
import { tween } from '../../../mcTree/utils/animate';
import { CardModel } from '../model/card';
import { OtherCardBoxCtrl } from './cardBox/otherCardBox';
import { CardBoxCtrl } from './cardBox/cardBox';

export interface Link {
    view: ui.game.seat.curSeatUI | ui.game.seat.otherSeatUI;
    empty_box: Laya.Sprite;
    active_box: Laya.Sprite;
    avatar: Laya.Image;
    die_avatar: Laya.Image;
    nickname: Laya.Text;
    card_box_ctrl: CardBoxCtrl; // 是否加载了用户
}

/**  */
export class SeatCtrl extends BaseCtrl {
    protected link = {} as Link;
    protected model: PlayerModel;
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

        this.link.empty_box = empty_box;
        this.link.active_box = active_box;
        this.link.avatar = avatar;
        this.link.die_avatar = die_avatar;
        this.link.nickname = nickname;
        this.link.card_box_ctrl = this.createCardBox(card_box);
    }
    protected createCardBox(card_box: Laya.Sprite): CardBoxCtrl {
        const card_box_ctrl = new OtherCardBoxCtrl(card_box);
        this.addChild(card_box_ctrl);
        card_box_ctrl.init();
        return card_box_ctrl;
    }
    protected initEvent() {}
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
    private clearPlayer = () => {
        this.unBindModeEvent();
        this.model = undefined;
        this.loadedPlayer = false;
        this.link.empty_box.visible = true;
        this.link.active_box.visible = false;
        this.link.avatar.skin = '';
        this.link.nickname.text = '';
        this.link.die_avatar.visible = false;
    };
    private bindModel() {
        /** 渲染初始化的信息 */
        const player = this.model;
        const card_list = player.card_list;
        for (const card of card_list) {
            this.addCard(card);
        }

        this.onModel(base_cmd.destroy, this.clearPlayer);
        this.onModel(player_cmd.add_card, this.addCard);
    }
    private unBindModeEvent() {
        this.offOtherEvent(this.model);
    }
    protected addCard = (card: CardModel) => {
        this.link.card_box_ctrl.addCard(card);
    };
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
