import { CheckCtrl, cmd, StatusData } from './checkCtrl';
import { log } from '../../../mcTree/utils/zutil';

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
        });
        music_check_ctrl.on(cmd.status_change, (data: StatusData) => {
            log(data);
        });
    }
}
