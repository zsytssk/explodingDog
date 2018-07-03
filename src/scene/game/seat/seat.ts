import { event } from '../../../mcTmpl/event';
import { BaseCtrl } from '../../../mcTmpl/ctrl/base';
import { PlayerModel } from '../model/player';

export interface Link {
    view: Laya.Node;
    empty_box: Laya.Sprite;
    active_box: Laya.Sprite;
    avatar: Laya.Image;
    die_avatar: Laya.Image;
    nickname: Laya.Label;
}

/**  */
export class SeatCtrl extends BaseCtrl {
    protected link = {} as Link;
    protected model: PlayerModel;
    constructor(view: Laya.Node) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        const view = this.link.view;
        const player_box = (view as any).player_box;
        const empty_box = (player_box as any).empty_box;
        const active_box = (player_box as any).active_box;
        const avatar = (player_box as any).avatar;
        const die_avatar = (player_box as any).die_avatar;
        const nickname = (player_box as any).nickname;

        this.link.empty_box = empty_box;
        this.link.active_box = active_box;
        this.link.avatar = avatar;
        this.link.die_avatar = die_avatar;
        this.link.nickname = nickname;
    }
    protected initEvent() {}
    public loadPlayer(player: PlayerModel) {
        this.link.empty_box.visible = false;
        this.link.active_box.visible = true;
        this.link.avatar.skin = player.avatar;
        this.link.nickname.text = player.nickname;
        this.link.die_avatar.visible = false;

        this.model = player;
        this.bindModeEvent();
    }
    private clearPlayer = () => {
        this.unBindModeEvent();
        this.model = undefined;
        this.link.empty_box.visible = true;
        this.link.active_box.visible = false;
        this.link.avatar.skin = '';
        this.link.nickname.text = '';
        this.link.die_avatar.visible = false;
    };
    private bindModeEvent() {
        this.onModel(event.destroy, this.clearPlayer);
    }
    private unBindModeEvent() {
        this.offAllOtherEvent(this.model);
    }
}