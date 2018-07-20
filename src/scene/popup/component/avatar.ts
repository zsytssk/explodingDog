import { getAvatar } from "../../../utils/tool";


export class Avatar extends ui.popup.component.avatarUI {
    constructor(data) {
        super();
        this.init(data);
    }
    init({ avatar, nickname, isDead, isWinUser, getScore }) {
        this.avatar.skin = isDead ? 'images/game/avatar_die.png' : getAvatar(avatar);
        this.username.changeText(nickname);
        this.crown.visible = !!isWinUser;
        if (getScore) {
            this.score.visible = true;
            this.score.text = getScore > 0 ? `积分+${getScore}` : `积分${getScore}`;
        }
    }
}