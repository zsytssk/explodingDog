import { CheckCtrl, cmd, StatusData } from './checkCtrl';
import { log } from '../../../mcTree/utils/zutil';
import { CONFIG } from '../../../data/config';

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
    }
    private initSatus() {
        const { bg_music_check_ctrl, music_check_ctrl } = this.link;
        let musicStatus = localStorage.getItem(CONFIG.music_switch_key) == '1' ? 'checked' : 'uncheck';
        let soundStatus = localStorage.getItem(CONFIG.sound_switch_key) == '1' ? 'checked' : 'uncheck';
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
            if (data.status == 'checked') {
                Laya.SoundManager.musicMuted = false;
                localStorage.setItem(CONFIG.music_switch_key, '1')
            } else {
                Laya.SoundManager.musicMuted = true;
                localStorage.setItem(CONFIG.music_switch_key, '0')
            }
        });
        music_check_ctrl.on(cmd.status_change, (data: StatusData) => {
            log(data);
            if (data.status == 'checked') {
                Laya.SoundManager.soundMuted = false;
                localStorage.setItem(CONFIG.sound_switch_key, '1')
            } else {
                Laya.SoundManager.soundMuted = true;
                localStorage.setItem(CONFIG.sound_switch_key, '0')
            }
        });
    }
}
