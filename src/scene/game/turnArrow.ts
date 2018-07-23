import { BaseCtrl } from '../../mcTree/ctrl/base';
import { getChildren } from "../../mcTree/utils/zutil";
import { tween } from "../../mcTree/utils/animate";

export interface Link {
    view: Laya.Node;
}

/** 指示箭头 */
export class TurnArrowCtrl extends BaseCtrl {
    name = 'turn_arrow_ctrl';
    protected link = {} as Link;
    private currentArrowBox: Laya.Box;
    private currentTurn = '0';
    constructor(view) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {

    }
    protected initEvent() { }
    public loadModel() { }

    /**
     * 显示箭头
     * @param playerCount 玩家数
     */
    public showArrow(playerCount: number) {
        const arrowBox = this.link.view.getChildByName('arrow' + playerCount) as Laya.Box;
        if (arrowBox) {
            this.currentArrowBox = arrowBox;
            arrowBox.visible = true;
        }
    }

    /**
     * 
     * @param clockWise '0':顺时针方向'1':逆时针
     */
    public rotate(clockWise) {
        if (!this.currentArrowBox || clockWise == this.currentTurn) {
            return;
        }
        this.currentTurn = clockWise;
        const arrows = getChildren(this.currentArrowBox);
        arrows.forEach(arrow => {
            let endRotation = arrow.rotation += 180;
            tween({
                sprite: arrow,
                start_props: { rotation: arrow.rotation },
                end_props: { rotation: endRotation },
                time: 1000,
            })
        });
    }
}
