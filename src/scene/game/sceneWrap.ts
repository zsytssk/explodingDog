import { CMD } from '../../data/cmd';
import { ASSETS } from '../../data/assets';

import { GameCtrl } from './main';

export class Hall extends Sail.Scene {
    constructor() {
        super();
        Laya.loader.load(
            ASSETS.GAME,
            new Laya.Handler(this, () => {
                this.init();
            }),
        );
    }

    init() {
        const game_ui = new ui.game.mainUI();
        const game_ctrl = new GameCtrl(game_ui);
        game_ctrl.init();
        this.addChild(game_ui);
    }
    initEvent() {}

    onExit() {
        // Sail.io.unregister(this.ACTIONS);
    }

    onResize(width, height) {}
}
