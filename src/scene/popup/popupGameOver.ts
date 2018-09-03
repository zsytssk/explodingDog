import { CONFIG } from './../../data/config';
import { Avatar } from './component/avatar';
import { isCurPlayer, shareToWx } from '../../utils/tool';
import { tween, fade_in } from '../../mcTree/utils/animate';
import { log, getChildren, ellipsisStr } from '../../mcTree/utils/zutil';
import { CMD } from '../../data/cmd';
import { Hall } from '../hall/scene';
import { BgCtrl } from '../component/bgCtrl';
import { popupRankChange } from './popupRankChange';
import { rankIcon } from '../hall/rankIcon';

export class PopupGameOver extends ui.popup.popupGameOverUI {
    private isUserCreate; // 是否为用户创建的房间
    name = 'game_over';
    group = 'exploding';
    private onOpenFuns = []; //弹出后播放动画
    CONFIG = {
        closeByGroup: true,
        closeOther: true
    };
    game_ctrl;
    constructor(game_ctrl) {
        super();
        this.game_ctrl = game_ctrl;
        this.init();
    }
    init() {
        const { bg } = this;
        const bg_ctrl = new BgCtrl(bg);
        bg_ctrl.init();

        this.progressBar.bar.y = 2;
        this.btnBack.once(Laya.Event.CLICK, this, () => {
            if (!this.isUserCreate) {
                this.game_ctrl.outRoom();
                return;
            }
            Sail.io.emit(CMD.OUT_ROOM);
        });
        this.btnAgain.once(Laya.Event.CLICK, this, () => {
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
        this.btnShare.on(Laya.Event.CLICK, this, () => {
            shareToWx(
                1,
                CONFIG.friend_title,
                CONFIG.frend_msg,
                CONFIG.share_icon,
                CONFIG.site_url + CONFIG.redirect_uri,
            );
        });
    }
    onOpened() {
        this.onOpenFuns.forEach(fun => fun());
    }
    updateView(data) {
        const { avatarBox } = this;
        // 添加用户头像
        data.list.forEach((user, index) => {
            let avatar = new Avatar(user);
            avatar.left =
                ((this.avatarBox.width + 200) / (data.list.length + 1)) * (index + 1) -
                200;
            this.avatarBox.addChild(avatar);
            if (user.isWinUser) {
                this.winUserNamme.text = ellipsisStr(user.nickname, 10);
                this.onOpenFuns.push(avatar.showCrown.bind(avatar));
            }
            if (isCurPlayer(user.userId)) {
                if (user.updateInfo.level.isChange) {
                    this.onOpenFuns.push(avatar.levelUp.bind(avatar));
                }
                const danGradingData = user.updateInfo.danGrading;
                if (danGradingData.isChange) {
                    let isAdvance = danGradingData.new > danGradingData.old;
                    this.onOpenFuns.push(() => {
                        Sail.director.popScene(new popupRankChange(user.danGrading, isAdvance));
                    });
                }
                if (data.isUserCreate) {
                    this.levLabel.visible = false;
                    this.progressBar.visible = false;
                } else {
                    this.levLabel.text = `Lv:${user.level}`;
                    tween({
                        sprite: this.progressBar,
                        start_props: { value: 0 },
                        end_props: { value: user.currentExp / user.nextLvlExp },
                        time: 1000,
                        ease_fn: Laya.Ease.cubicInOut,
                    });
                }
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
                const maxInfo = new MaxInfo(key, ellipsisStr(item.nickname, 10));
                maxInfo.top = 65 * index++;
                maxInfo.visible = false;
                this.maxInfoBox.addChild(maxInfo);
            }
        }
        this.isUserCreate = data.isUserCreate;
        this.timerOnce(3000, this, () => {
            getChildren(this.maxInfoBox).forEach((item, index) => {
                this.timerOnce(700 * index, this, () => {
                    fade_in(item);
                })
            })
        });
        this.timerOnce(5000, this, () => {
            Laya.Tween.to(this.btnAgain, { alpha: 1 }, 1000);
            Laya.Tween.to(this.btnBack, { alpha: 1 }, 1000);
            Laya.Tween.to(this.btnShare, { alpha: 1 }, 1000);
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
