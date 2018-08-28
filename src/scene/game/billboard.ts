import { GUIDE_EXCLUDE } from './../../data/card';
import { PlayerModel } from './model/player';
import { getAvatar, getCardInfo, getSoundPath } from '../../utils/tool';
import { TURN_CHANGE_ID, TURN_CHANGE_INFO } from '../../data/card';
import { log, ellipsisStr } from '../../mcTree/utils/zutil';
import { slide_left_in } from '../../mcTree/utils/animate';
import { CMD } from '../../data/cmd';

export class BillBoardCtrl {
    private link;
    private msgList = [];
    private gameCtrl;
    private guideLock = false;
    constructor(view: ui.game.billboardUI, gameCtrl) {
        this.gameCtrl = gameCtrl;
        this.init(view);
    }
    init(view) {
        this.initLink(view);
        this.initEvent();
    }
    initLink(view) {
        this.link = {
            view,
            ...view,
        };
    }

    private initEvent() {
        this.link.btn_guide.on(Laya.Event.CLICK, this, () => {
            if (this.guideLock) {
                return;
            }
            this.guideLock = true;
            setTimeout(() => {
                this.guideLock = false;
            }, 2000);
            Sail.io.emit(CMD.GET_HIT_TIPS);
        });
    }

    public addMsg(data) {
        const { fromUser, cardId } = data;
        if (!fromUser || !cardId) {
            return;
        }
        this.msgList.push(data);
        if (this.msgList.length == 1) {
            this.updateMsg();
        }
    }

    private updateMsg() {
        if (!this.msgList[0]) {
            return;
        }
        this.gameCtrl.hideDrawCardAni();
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
        const { operationTip, cardIcon, avatarFrom, avatarTo, btn_guide } = this.link;
        avatarFrom.skin = getAvatar(fromUser.avatar);
        let text = ellipsisStr(fromUser.nickname, 14);

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
            let toUserName = ellipsisStr(toUser.nickname, 12);
            if (cardId == '3401' && step == 3) {
                text += `获得${toUserName}`;
            } else {
                text += `对${toUserName}`;
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
        if (fromUser.is_cur_player && GUIDE_EXCLUDE.indexOf(cardId + '_' + step) == -1) {
            btn_guide.visible = true;
        } else {
            btn_guide.visible = false;
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
