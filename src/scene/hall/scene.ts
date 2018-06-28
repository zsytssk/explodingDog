import { CMD } from '../../data/cmd';
import { ASSETS } from '../../data/assets';

import { TopBar } from './topbar';
import './valuebar';
import { HallContent } from './content';

export class Hall extends Sail.Scene {
    constructor() {
        super();
        Laya.loader.load(
            ASSETS.HALL,
            new Laya.Handler(this, () => {
                this.init();
            }),
        );
    }

    init() {
        this.mainPage = new Laya.Box();
        this.cardPage = new Laya.Box();
        let pages = [this.mainPage, this.cardPage];
        pages.forEach(page => {
            page.size(Laya.stage.width, Laya.stage.height);
            page.centerY = 0;
        });

        this.ACTIONS = {
            [CMD.GET_USER_INFO]: this.setUserInfo,
            [CMD.GET_USER_AMOUNT]: this.setUserAmount,
        };
        Sail.io.register(this.ACTIONS, this);
        //主页面
        let bgImg = new Laya.Image('images/bg/bg.jpg');
        this.topbar = new TopBar();
        this.topbar.top = 20;
        this.content = new HallContent();
        this.content.centerY = 60;
        this.mainPage.addChildren(this.topbar, this.content);
        //选择卡包页面

        this.addChildren(bgImg, this.mainPage, this.cardPage);
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
}
