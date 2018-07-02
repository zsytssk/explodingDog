import { CMD } from '../../data/cmd';
import { RES } from '../../data/res';

import { TopBar } from './topbar';
import './valuebar';
import { HallContent } from './content';

export class Hall extends Sail.Scene {
    constructor() {
        super();
        Laya.loader.load(
            RES.HALL,
            new Laya.Handler(this, () => {
                this.init();
            }),
        );
    }

    init() {
        this.ACTIONS = {
            [CMD.GET_USER_INFO]: this.setUserInfo,
            [CMD.GET_USER_AMOUNT]: this.setUserAmount,
            [CMD.JOIN_ROOM]: this.joinRoom
        };
        Sail.io.register(this.ACTIONS, this);
        let bgImg = new Laya.Image('images/bg/bg.jpg');
        this.topbar = new TopBar();
        this.topbar.top = 20;
        this.content = new HallContent();
        this.content.centerY = 60;
        this.addChildren(bgImg, this.topbar, this.content);
        this.initEvent();

        Sail.io.emit(CMD.GET_USER_INFO);
        Sail.io.emit(CMD.GET_USER_AMOUNT);
    }
    initEvent() {}

    onExit() {
        // Sail.io.unregister(this.ACTIONS);
    }

    onResize(width, height) {}

    setUserInfo(data) {
        this.content.updateView(data);
    }

    setUserAmount(data) {
        this.topbar.updateView(data);
    }

    joinRoom(data) {
        // Sail.director.runScene(new Hall());
    }
}
