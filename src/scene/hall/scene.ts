import { CMD } from '../../data/cmd';
import { GameWrap } from '../game/sceneWrap';
import { loadAssets } from '../loaing/main';
import { PopuTip } from '../popup/popupTip';
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
        this.bgImg = new Laya.Image('images/bg/bg.jpg');
        this.bgImg.size(Laya.stage.width, Laya.stage.height);
        this.topbar = new TopBar();
        this.topbar.top = 20;
        this.content = new HallContent();
        this.content.centerY = 60;
        this.addChildren(this.bgImg, this.topbar, this.content);
        this.initEvent();

        Sail.io.emit(CMD.GET_USER_INFO);
        Sail.io.emit(CMD.GET_USER_AMOUNT);
    }
    initEvent() { }

    onExit() {
        Sail.io.unregister(this.ACTIONS);
    }

    onResize(width, height) {
        this.bgImg.size(Laya.stage.width, Laya.stage.height);
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
            Sail.director.popScene(new PopuTip(msg));
        }
    }

    createRoom(data, code, msg) {
        Sail.director.closeAll();
        if (code == 200) {
            Sail.director.runScene(new GameWrap());
        } else {
            alert(msg);
        }
    }
}
