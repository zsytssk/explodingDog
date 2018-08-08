import { CMD } from '../../data/cmd';
import { RES } from '../../data/res';

import { GameCtrl } from './main';
import { loadAssets } from '../loading/main';
export class GameWrap extends Sail.Scene {
    constructor() {
        super();
        loadAssets('game').then(() => {
            this.init();
        });
    }

    public init() {
        const game_ui = new ui.game.mainUI();
        const game_ctrl = new GameCtrl(game_ui);
        game_ctrl.init();
        this.addChild(game_ui);
    }
}
