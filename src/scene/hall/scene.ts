import { CMD } from '../../data/cmd';
import { GameWrap } from '../game/sceneWrap';
import { loadAssets } from '../loaing/main';
import { PopupTip } from '../popup/popupTip';
import { TopBar } from './topbar';
import './valuebar';
import { HallContent } from './content';

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
        Laya.timer.loop(60 * 1000, this, this.updateUserAmount);
    }
    initEvent() {}

    onExit() {
        Laya.timer.clear(this, this.updateUserAmount);
        Sail.io.unregister(this.ACTIONS);
    }

    onResize(width, height) {}
    updateUserAmount() {
        Sail.io.emit(CMD.GET_USER_AMOUNT);
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
}
