import { CONFIG } from './../../data/config';
import { shareToWx, getShareUrl } from '../../utils/tool';
const title_friend = '这条二哈蠢爆了，竟然敢玩这东西！';
const title_zone = '《炸弹狗》拼人品，拼智商。高智商的快来挑战！1768游戏————好玩的积分娱乐平台';
const msg_friend = '全新桌游已经上线，智商碾压他人的机会已经来临！';
const msg_zone = '';
export class popupShare extends ui.popup.popupShareUI {
    constructor() {
        super();
        this.initEvent();
    }
    CONFIG = {
        closeOnSide: true
    }
    initEvent() {
        this.btn_friend.on(Laya.Event.CLICK, this, () => {
            shareToWx(
                1,
                title_friend,
                msg_friend,
                CONFIG.share_icon,
                getShareUrl()
            );
        });
        this.btn_zone.on(Laya.Event.CLICK, this, () => {
            shareToWx(
                2,
                title_zone,
                msg_zone,
                CONFIG.share_icon,
                getShareUrl()
            );
        });
    }
}