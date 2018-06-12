import { SceneCtrl } from '../component/scene';
/** load控制器 */
export class LoadCtrl extends SceneCtrl {
    public readonly name = 'load';
    constructor() {
        super(ui.loadUI);
    }
}
