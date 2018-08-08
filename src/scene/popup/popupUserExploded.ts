import { getAvatar } from "../../utils/tool";
import { Avatar } from "./component/avatar";
import { getElementsByName } from "../../mcTree/utils/zutil";
import { scale_in } from "../../mcTree/utils/animate";

export class PopupUserExploded extends ui.popup.popupUserExplodedUI {
    CONFIG = {
        shadowAlpha: 0.8,
        closeByGroup: true,
        autoClose: 5000
    }
    group = 'exploding';
    private explodeUserAvatar;
    constructor() {
        super();
    }

    updateData(data) {
        //更新数据
        this.explodeUserName.changeText(data.explodeUserName);
        this.remainBomb.changeText(data.remainBomb);
        this.remainCard.changeText(data.remainCard);
        this.remainUser.changeText(data.remainUser);
        this.bombProb.changeText(data.bombProb + '%')
        //显示头像
        if (Array.isArray(data.userList)) {
            data.userList.forEach((user, index) => {
                let avatar = new Avatar(user);
                if (data.explodeUserId == user.userId) {
                    this.explodeUserAvatar = avatar;
                }
                avatar.left = (this.avatarBox.width - 80) / (data.userList.length + 1) * (index + 1);
                this.avatarBox.addChild(avatar);
            });
        }

    }

    onOpened() {
        getElementsByName(this, 'infoBox').forEach((item, index) => {
            this.timerOnce(800 * (index + 1), this, () => {
                scale_in(item, 300, 'backOut');
            })
        });
        let ani = new Laya.Skeleton();
        ani.load('animation/user_exploded.sk', new Laya.Handler(this, () => {
            this.explodeUserAvatar.addChild(ani);
            ani.pos(0.5 * this.explodeUserAvatar.width, 0.5 * this.explodeUserAvatar.height);
            ani.play(0, false);
        }));
    }
}

