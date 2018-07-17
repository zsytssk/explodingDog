import { getAvatar } from "../../utils/tool";

export class popupUserExploded extends ui.popup.popupUserExplodedUI {
    constructor() {
        super();
    }

    updateView(data) {
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
                avatar.left = 100 + (this.avatarBox.width - 200) / (data.userList.length + 1) * (index + 1);
                this.avatarBox.addChild(avatar);
            });
        }
        //动效

    }
}

class Avatar extends ui.popup.component.avatarUI {
    constructor(data) {
        super();
        this.init(data);
    }
    init({ avatar, nickname, isDead }) {
        this.avatar.skin = isDead ? 'images/game/avatar_die.png' : getAvatar(avatar);
        this.username.changeText(nickname);
    }

}