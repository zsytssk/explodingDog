import { PlayerModel } from './model/player';
import { getAvatar } from '../../utils/tool';
import { CARD_DISCRIBE_MAP } from '../../data/card';

export class BillBoardCtrl {
    private link;
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

    public updateInfo({
        fromUser,
        toUser,
        cardId,
        step,
    }: {
        fromUser: PlayerModel;
        toUser?: PlayerModel;
        cardId: string;
        step?: number;
    }) {
        const { operationTip, cardIcon, avatarFrom, avatarTo } = this.link;
        avatarFrom.skin = getAvatar(fromUser.avatar);
        let text = fromUser.name;
        if (toUser) {
            text += `对${toUser.name}`;
            avatarTo.skin = getAvatar(toUser.avatar);
        } else {
            avatarTo.skin = `images/game/card/icon_unknow.png`;
        }
        text += '\n';
        const cardDescribe = CARD_DISCRIBE_MAP[cardId];
        if (cardDescribe.info) {
            text += `${cardDescribe.info[step]}`;
        } else {
            text += `使用了${cardDescribe.name}`;
        }
        // switch (cardId) {
        //     case '3001':
        //         text += `${cardDescribe.info[step]}`;
        //         break;
        //     default:
        //         text += `使用了${cardDescribe.name}`;
        //         break;
        // }
        operationTip.text = text;
        if (cardDescribe.icon) {
            if (!cardIcon.visible) {
                cardIcon.visible = true;
            }
            cardIcon.skin = `images/game/card/icon_${cardDescribe.icon}.png`;
        } else {
            cardIcon.visible = false;
        }
    }
}
