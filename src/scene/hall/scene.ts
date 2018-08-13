import { CMD } from '../../data/cmd';
import { GameWrap } from '../game/sceneWrap';
import { loadAssets } from '../loading/main';
import { PopupTip } from '../popup/popupTip';
import { TopBar } from './topbar';
import './valuebar';
import { HallContent } from './content';
import { GuideView } from '../guide/guideView';
import { PopupDaily } from '../popup/popupDaily';
import { nameMap, detectModel } from '../../mcTree/utils/zutil';
import { CONFIG } from '../../data/config';
import { getSoundPath, getRoomId, resetRoomId } from '../../utils/tool';

export class Hall extends Sail.Scene {
    constructor() {
        super();

        loadAssets('hall').then(() => {
            this.init();
        });
    }

    init() {
        this.ACTIONS = {
            [CMD.GET_USER_INFO]: this.setUserInfo,
            [CMD.GET_USER_AMOUNT]: this.setUserAmount,
            [CMD.JOIN_ROOM]: this.joinRoom,
            [CMD.CREATE_ROOM]: this.createRoom,
            [CMD.GET_HALL_USER_STATUS]: this.setUserStatus,
            [CMD.GET_DAILY_AWARDS]: () => {
                Sail.io.emit(CMD.GET_USER_AMOUNT);
            },
        };
        Sail.io.register(this.ACTIONS, this);

        this.topbar = new TopBar();
        this.topbar.top = 20;
        this.content = new HallContent();
        this.content.centerY = 60;
        this.addChildren(this.content, this.topbar);
        this.initEvent();
        this.onResize(Laya.stage.width, Laya.stage.height);

        Sail.io.emit(CMD.GET_USER_INFO);
        Sail.io.emit(CMD.GET_USER_AMOUNT);
        Sail.io.emit(CMD.GET_HALL_USER_STATUS);
        Laya.timer.loop(60 * 1000, this, this.updateUserAmount);

        const room_id = getRoomId();
        if (room_id) {
            resetRoomId();
            Sail.io.emit(CMD.JOIN_ROOM, {
                roomId: room_id,
                type: 'fixed',
            });
        }

        this.initSound();
    }

    initSound() {
        if (localStorage.getItem(CONFIG.music_switch_key) == '1') {
            Laya.SoundManager.playMusic(getSoundPath('bgm_hall'), 0);
        }
    }

    initEvent() { }

    onExit() {
        Laya.SoundManager.stopMusic();
        Laya.timer.clear(this, this.updateUserAmount);
        Sail.io.unregister(this.ACTIONS);
    }

    onResize(width?, height?) {
        this.centerX = 0;
        this.centerY = 0;
        this.width = 1334;
        this.height = 750;
    }
    updateUserAmount() {
        Sail.io.emit(CMD.GET_USER_AMOUNT);
        Sail.io.emit(CMD.GET_HALL_USER_STATUS, { type: 'dogFood' });
    }
    setUserInfo(data) {
        this.content.updateView(data);
    }

    setUserAmount(data) {
        this.topbar.updateView(data);
    }

    joinRoom(data, code, msg) {
        Sail.director.closeAll();
        if (code == 200) {
            Sail.director.runScene(new GameWrap());
        } else {
            Sail.director.popScene(new PopupTip(msg));
        }
    }

    createRoom(data, code, msg) {
        Sail.director.closeAll();
        if (code == 200) {
            Sail.director.runScene(new GameWrap());
        } else {
            Sail.director.popScene(new PopupTip(msg));
        }
    }

    setUserStatus(data) {
        if (data.needGuide) {
            loadAssets('guide').then(() => {
                Sail.director.runScene(new GuideView());
            });
            return;
        }
        if (data.isFirstLogin) {
            Sail.director.popScene(new PopupDaily(data.firstLoginAward));
        }
        this.topbar.setRedPoint(data.hasDogFood);
    }
}
