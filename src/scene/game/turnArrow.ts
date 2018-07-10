import { BaseCtrl } from '../../mcTree/ctrl/base';
import { getChildren } from "../../mcTree/utils/zutil";
import { tween } from "../../mcTree/utils/animate";

export interface Link {
    view: Laya.Node;
}

/** 指示箭头 */
export class TurnArrowCtrl extends BaseCtrl {
    protected link = {} as Link;
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() { }
    protected initEvent() { }
    public loadModel() { }

    /**
     * 
     * @param clockWise true:顺时针方向
     */
    public rotate(clockWise?: boolean) {
        const arrows = getChildren(this.link.view);
        arrows.forEach(arrow => {
            let endRotation = clockWise ? arrow.rotation += 180 : arrow.rotation -= 180;
            tween({
                sprite: arrow,
                start_props: { rotation: arrow.rotation },
                end_props: { rotation: endRotation },
                time: 1000,
            })
        });
    }
}
