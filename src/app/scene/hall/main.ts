import { SceneCtrl } from '../../component/scene';

export class HallCtrl extends SceneCtrl {
    public readonly name = 'hall';
    constructor() {
        super(ui.hallUI);
    }
}
