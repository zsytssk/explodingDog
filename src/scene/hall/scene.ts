import { CMD } from '../../data/cmd';
import { GameWrap } from '../game/sceneWrap';
import { loadAssets } from '../loaing/main';
import { PopupTip } from '../popup/popupTip';
import { TopBar } from './topbar';
import './valuebar';
import { HallContent } from './content';
import { GuideView } from '../guide/guideView';
import { PopupDaily } from '../popup/popupDaily';

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
            [CMD.GET_DAILY_AWARDS]: () => { Sail.io.emit(CMD.GET_USER_AMOUNT); }
        };
        Sail.io.register(this.ACTIONS, this);

        this.topbar = new TopBar();
        this.topbar.top = 20;
        this.content = new HallContent();
        this.content.centerY = 60;
        this.addChildren(this.content, this.topbar);
        this.initEvent();

        Sail.io.emit(CMD.GET_USER_INFO);
        Sail.io.emit(CMD.GET_USER_AMOUNT);
        Sail.io.emit(CMD.GET_HALL_USER_STATUS);
        Laya.timer.loop(60 * 1000, this, this.updateUserAmount);
    }
    initEvent() { }

    onExit() {
        Laya.timer.clear(this, this.updateUserAmount);
        Sail.io.unregister(this.ACTIONS);
    }

    onResize(width, height) { }
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
