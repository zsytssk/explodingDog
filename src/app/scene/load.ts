import { SceneCtrl } from '../component/scene';
/** load控制器 */
export class LoadCtrl extends SceneCtrl {
    public readonly name = 'load';
    public view: typeof ui.loadUI;
    constructor() {
        super(ui.loadUI);
    }
    public setProgress(x: number) {
        this.view.progress = x.toFixed(2);
    }
}
