import { getAvatar } from "../../utils/tool";
import { Avatar } from "./component/avatar";

export class PopupUserExploded extends ui.popup.popupUserExplodedUI {
    CONFIG = {
        shadowAlpha: 0.8,
        closeByGroup: true,
        autoClose: 2500
    }
    group = 'exploding';
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
        let explodeUserAvatar = null;
        if (Array.isArray(data.userList)) {
            data.userList.forEach((user, index) => {
                let avatar = new Avatar(user);
                if (data.explodeUserId == user.userId) {
                    explodeUserAvatar = avatar;
                }
                avatar.left = (this.avatarBox.width - 80) / (data.userList.length + 1) * (index + 1);
                this.avatarBox.addChild(avatar);
            });
        }
        //动效

    }
}

