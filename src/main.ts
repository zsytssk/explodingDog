import './sail/lib/primus';
import './sail/core/sail.core.js';
import './sail/core/sail.utils.js';
import './sail/core/sail.dialog.js';
import './sail/core/sail.scene.js';
import './sail/core/sail.director.js';
import './sail/core/sail.viewer.js';
import './sail/core/sail.io.js';
import './sail/core/sail.entrace.js';
import './sail/tools/keyboard';
import './sail/tools/notify';
import './effect/scaleBtn';

import { IO_CONFIG, GAME_CONFIG } from './data/config';
import { Hall } from './scene/hall/scene';

Sail.onStart = function() {
    if (Sail.DEBUG) {
        Laya.Stat.show();
    }
    Laya.SoundManager.setMusicVolume(0.4);
    Laya.SoundManager.autoStopMusic = true;
    Sail.keyboard = new Tools.KeyBoardNumber();

    Sail.io.init(IO_CONFIG);
    Sail.director.runScene(new Hall());
};
Sail.run(GAME_CONFIG);
