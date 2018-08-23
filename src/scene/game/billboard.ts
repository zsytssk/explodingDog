import { PlayerModel } from './model/player';
import { getAvatar, getCardInfo, getSoundPath } from '../../utils/tool';
import { TURN_CHANGE_ID, TURN_CHANGE_INFO } from '../../data/card';
import { log } from '../../mcTree/utils/zutil';
import { slide_left_in } from '../../mcTree/utils/animate';

export class BillBoardCtrl {
    private link;
    private msgList = [];
    constructor(view: ui.game.billboardUI) {
        this.init(view);
    }
    init(view) {
        this.initLink(view);
    }
    initLink(view) {
        this.link = {
            view,
            ...view,
        };
    }

    public addMsg(data) {
        this.msgList.push(data);
        if (this.msgList.length == 1) {
            this.updateMsg();
        }
    }

    private updateMsg() {
        if (!this.msgList[0]) {
            return;
        }
        const { view } = this.link;
        const period = 200;
        let originX = view.x;
        let localPoint = view.parent.globalToLocal(
            new Laya.Point(Laya.stage.width, 0),
        );
        Laya.Tween.to(
            view,
            { x: localPoint.x },
            period,
            null,
            new Laya.Handler(this, () => {
                if (!this.msgList[0]) {
                    return;
                }
                this.updateInfo(this.msgList[0]);
            }),
        );
        Laya.Tween.to(view, { x: originX }, period, null, null, period);

        this.link.view.timerOnce(1000, this, () => {
            this.msgList.shift();
            this.updateMsg();
        });
    }

    public updateInfo({
        fromUser,
        toUser,
        cardId,
        step = 1,
    }: {
            fromUser: PlayerModel;
            toUser?: PlayerModel;
            cardId: string;
            step?: number;
        }) {
        const { operationTip, cardIcon, avatarFrom, avatarTo } = this.link;
        avatarFrom.skin = getAvatar(fromUser.avatar);
        let text = fromUser.nickname;

        let icon;
        let name_zh;
        let intro_billbard;
        if (cardId === TURN_CHANGE_ID) {
            intro_billbard = TURN_CHANGE_INFO;
        } else {
            const card_info = getCardInfo(cardId);
            icon = card_info.icon;
            intro_billbard = card_info.intro_billbard;
            name_zh = card_info.name_zh;
        }

        if (toUser) {
            if (cardId == '3401' && step == 3) {
                text += `获得${toUser.nickname}`;
            } else {
                text += `对${toUser.nickname}`;
            }
            avatarTo.skin = getAvatar(toUser.avatar);
        } else if (cardId == TURN_CHANGE_ID) {
            avatarTo.skin = `images/component/card/icon/icon_card.png`;
        } else {
            avatarTo.skin = `images/component/card/icon/icon_unknow.png`;
        }
        text += '\n';

        if (intro_billbard) {
            text += `${intro_billbard[step - 1]}`;
        } else {
            text += `使用了${name_zh}`;
        }
        operationTip.text = text;

        if (icon) {
            if (!cardIcon.visible) {
                cardIcon.visible = true;
            }
            cardIcon.skin = `images/component/card/icon/${icon}.png`;
        } else {
            cardIcon.visible = false;
        }
    }
    public async show(isPlaying) {
        const { view } = this.link;
        if (isPlaying) {
            view.visible = true;
            return;
        }
        view.visible = false;
        return slide_left_in(view, 500);
    }
    public hide() {
        const { view } = this.link;
        view.visible = false;
    }
    public reset() {
        const { operationTip, cardIcon, avatarFrom, avatarTo } = this.link;
        avatarTo.graphics.clear();
        avatarFrom.graphics.clear();
        cardIcon.graphics.clear();
        operationTip.text = '游戏开始';
    }
}
