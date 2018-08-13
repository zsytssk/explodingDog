import { getAvatar } from "../../../utils/tool";
import { rankIcon } from "../../hall/rankIcon";
import { log } from "../../../mcTree/utils/zutil";


export class Avatar extends ui.popup.component.avatarUI {
    private userId: string;
    constructor(data) {
        super();
        this.init(data);
    }
    init({ avatar, nickname, isDead, isWinUser, getScore, userId, danGrading }) {
        this.userId = userId;
        this.avatar.skin = isDead ? 'images/game/avatar_die.png' : getAvatar(avatar);
        this.username.changeText(nickname);
        if (getScore) {
            this.score.visible = true;
            this.score.zOrder = 5;
            this.score.text = getScore > 0 ? `积分+${getScore}` : `积分${getScore}`;
        }
        if (danGrading) {
            let rank = new rankIcon(danGrading);
            rank.y = 100;
            rank.centerX = -2;
            this.addChild(rank);
        }
    }
    public getUserId() {
        return this.userId;
    }
    public showInviteIcon() {
        this.inviteStatus.visible = true;
        this.inviteStatus.zOrder = 5;
    }
    public levelUp() {
        let ani = new Laya.Skeleton();
        ani.load('animation/shengji.sk', new Laya.Handler(this, () => {
            ani.play(0, false);
            ani.pos(95, 95);
            this.addChild(ani);
        }));
    }
    public showCrown() {
        let crown = new Laya.Skeleton();
        crown.load('animation/crown.sk', new Laya.Handler(this, () => {
            crown.on(Laya.Event.STOPPED, this, () => {
                crown.play('wait', true);
            });
            crown.play('show', false);
            crown.pos(90, 0);
            crown.zOrder = -1;
            this.addChild(crown);
        }));
    }

    /**
     * 
     * @param status 1.接受 2.拒绝 3.待定
     */
    public setInviteStatus(status) {
        if ([1, 2, 3].indexOf(status) == -1) {
            return;
        }
        this.inviteStatus.index = status - 1;
    }
}