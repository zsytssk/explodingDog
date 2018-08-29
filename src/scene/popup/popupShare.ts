import { CONFIG } from './../../data/config';
import { shareToWx } from '../../utils/tool';
const share_title = '这条二哈蠢爆了，竟然敢玩这东西！';
const msg_friend = '全新桌游已经上线，智商碾压他人的机会已经来临！';
const msg_zone = '《炸弹狗》拼人品，拼智商。高智商的快来挑战！1768游戏————好玩的积分娱乐平台';
const share_icon =
    'https://h3.jkimg.net/gameapp_24caipiao/images/game/common/share_logo_gm.png';
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
                share_title,
                msg_friend,
                share_icon,
                CONFIG.site_url + CONFIG.redirect_uri,
            );
        });
        this.btn_zone.on(Laya.Event.CLICK, this, () => {
            shareToWx(
                2,
                '',
                msg_zone,
                share_icon,
                CONFIG.site_url + CONFIG.redirect_uri,
            );
        });
    }
}