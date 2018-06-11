import { SceneCtrl } from '../../component/scene';

export class HallCtrl extends SceneCtrl {
    public name = 'hall';
    constructor() {
        super(ui.hallUI);
    }
}
