import { CONFIG } from './../../../data/config';
import { CheckCtrl, cmd, StatusData } from './checkCtrl';
import { log } from '../../../mcTree/utils/zutil';
import { splitStr, isWeixin } from '../../../utils/tool';

type Link = {
    music_check_ctrl: CheckCtrl;
    bg_music_check_ctrl: CheckCtrl;
};
export class PopupSetting extends ui.popup.setting.popUI {
    public name = 'setting';
    private link = {} as Link;
    public CONFIG = {
        closeOnSide: true,
    };
    constructor() {
        super();
        this.init();
    }
    private init() {
        this.initLink();
        this.initEvent();
        this.initSatus();
        this.initUserData();
    }
    private initUserData() {
        if (GM && GM.userSourceDescription) {
            this.platform.text = GM.userSourceDescription;
        }
        this.userInfo.text = `当前账号：${CONFIG.user_name}（ID:${CONFIG.user_id}）`;

    }
    private initSatus() {
        const { bg_music_check_ctrl, music_check_ctrl } = this.link;
        const musicStatus =
            localStorage.getItem(CONFIG.music_switch_key) === '1'
                ? 'checked'
                : 'uncheck';
        const soundStatus =
            localStorage.getItem(CONFIG.sound_switch_key) === '1'
                ? 'checked'
                : 'uncheck';
        bg_music_check_ctrl.setStatus(musicStatus, true);
        music_check_ctrl.setStatus(soundStatus, true);
    }

    private initLink() {
        const { music_check, bg_music_check } = this;
        const music_check_ctrl = new CheckCtrl(music_check);
        const bg_music_check_ctrl = new CheckCtrl(bg_music_check);

        this.link = {
            bg_music_check_ctrl,
            music_check_ctrl,
        };
    }
    private initEvent() {
        const { bg_music_check_ctrl, music_check_ctrl } = this.link;
        bg_music_check_ctrl.on(cmd.status_change, (data: StatusData) => {
            log(data);
            if (data.status === 'checked') {
                Laya.SoundManager.musicMuted = false;
                localStorage.setItem(CONFIG.music_switch_key, '1');
            } else {
                Laya.SoundManager.musicMuted = true;
                localStorage.setItem(CONFIG.music_switch_key, '0');
            }
        });
        music_check_ctrl.on(cmd.status_change, (data: StatusData) => {
            log(data);
            if (data.status === 'checked') {
                Laya.SoundManager.soundMuted = false;
                localStorage.setItem(CONFIG.sound_switch_key, '1');
            } else {
                Laya.SoundManager.soundMuted = true;
                localStorage.setItem(CONFIG.sound_switch_key, '0');
            }
        });
        this.btnLogout.on(Laya.Event.CLICK, this, () => {
            if (isWeixin()) {
                location.href = CONFIG.redirect_uri + '&st=logout';
            } else {
                Sail.io.ajax(null, 'GET', CONFIG.site_url, {
                    act: 'user',
                    st: 'logout'
                });
                if (GM && GM.userLoginUrl) {
                    location.href = GM.userLoginUrl;
                }
            }
        });
    }
}
