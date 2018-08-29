import { CMD } from '../../data/cmd';
import { RES } from '../../data/res';

import { GameCtrl } from './main';
import { loadAssets } from '../loading/main';
export class GameWrap extends Sail.Scene {
    public name = 'scene_game';
    private game_ctrl;
    constructor() {
        super();
        loadAssets('game').then(() => {
            this.init();
        });
    }

    public init() {
        const game_ui = new ui.game.mainUI();
        this.game_ctrl = new GameCtrl(game_ui);
        this.game_ctrl.init();
        this.addChild(game_ui);
    }

    public onExit() {
        this.game_ctrl && this.game_ctrl.destroy();
    }
}
