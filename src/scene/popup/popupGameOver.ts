import { Avatar } from './component/avatar';
import { isCurPlayer } from '../../utils/tool';
import { tween } from '../../mcTree/utils/animate';
import { log, getChildren } from '../../mcTree/utils/zutil';
import { CMD } from '../../data/cmd';
import { Hall } from '../hall/scene';

export class PopupGameOver extends ui.popup.popupGameOverUI {
    private isUserCreate; // 是否为用户创建的房间
    name = 'game_over';
    group = 'exploding';
    CONFIG = {
        closeByGroup: true,
    };
    game_ctrl;
    constructor(game_ctrl) {
        super();
        this.game_ctrl = game_ctrl;
        this.init();
    }
    init() {
        this.progressBar.bar.y = 2;
        this.btnBack.on(Laya.Event.CLICK, this, () => {
            if (!this.isUserCreate) {
                this.game_ctrl.outRoom();
                return;
            }
            Sail.io.emit(CMD.OUT_ROOM);
        });
        this.btnAgain.on(Laya.Event.CLICK, this, () => {
            if (!this.isUserCreate) {
                this.close();
                // 重新开始匹配
                Sail.io.emit(CMD.JOIN_ROOM, {
                    cardType: this.game_ctrl.getCardType(),
                    type: 'quick',
                });
            } else {
                Sail.io.emit(CMD.PLAY_INVITE);
            }
        });
    }
    updateView(data) {
        const { avatarBox } = this;
        // 添加用户头像
        data.list.forEach((user, index) => {
            let avatar = new Avatar(user);
            avatar.left =
                (this.avatarBox.width / (data.list.length + 1)) * (index + 1) -
                100;
            this.avatarBox.addChild(avatar);
            if (user.isWinUser) {
                this.winUserNamme.text = user.nickname;
            }
            if (isCurPlayer(user.userId)) {
                log(user.userId);
                this.levLabel.text = `Lv:${user.level}`;
                tween({
                    sprite: this.progressBar,
                    start_props: { value: 0 },
                    end_props: { value: user.currentExp / user.nextLvlExp },
                    time: 1000,
                    ease_fn: Laya.Ease.cubicInOut,
                });
            }
        });
        // maxinfo
        let index = 0;
        for (const key in data.maxInfo) {
            if (!data.maxInfo.hasOwnProperty(key)) {
                continue;
            }
            const item = data.maxInfo[key];
            if (item && Object.keys(item).length !== 0) {
                const maxInfo = new MaxInfo(key, item.nickname);
                maxInfo.top = 65 * index++;
                this.maxInfoBox.addChild(maxInfo);
            }
        }
        this.isUserCreate = data.isUserCreate;
        this.timerOnce(3000, this, () => {
            Laya.Tween.to(this.btnAgain, { alpha: 1 }, 1000);
            Laya.Tween.to(this.btnBack, { alpha: 1 }, 1000);
        });
    }

    public showInviteIcon(data) {
        getChildren(this.avatarBox).forEach(avatar => {
            avatar.showInviteIcon();
            if (data.inviteInfo.userId == avatar.getUserId()) {
                avatar.setInviteStatus(1);
            }
        });
    }

    public updateInviteIcon(data) {
        getChildren(this.avatarBox).forEach(avatar => {
            data.list.forEach(item => {
                log(item);
                if (item.userId == avatar.getUserId() && item.status != 0) {
                    avatar.setInviteStatus(item.status);
                }
            });
        });
    }
}

class MaxInfo extends ui.popup.component.maxInfoUI {
    constructor(type, userName) {
        super();
        this.type.skin = `images/game/text_max_${type}.png`;
        this.userName.text = userName;
    }
}
