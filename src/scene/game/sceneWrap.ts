import { CMD } from '../../data/cmd';
import { RES } from '../../data/res';

import { GameCtrl } from './main';

export class GameWrap extends Sail.Scene {
    constructor() {
        super();
        Laya.loader.load(
            RES.GAME.concat(RES.COMPONENT),
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
