import { NodeCtrl } from './node';
/**
 * 黑色背景的控制器
 */
export class BgCtrl extends NodeCtrl {
    view: Laya.Sprite;
    config: i_bgctrl_config;
    constructor(color, width, height, alpha) {
        super(new Laya.Sprite());
        this.config = {
            color: color,
            width: width,
            height: height,
            alpha: alpha,
        };
    }
    public init() {
        let view = this.view;
        let graphics = view.graphics;
        let width = this.config.width;
        let height = this.config.height;
        let color = this.config.color;
        view.alpha = this.config.alpha;

        view.width = width;
        view.height = height;

        graphics.drawRect(0, 0, width, height, color);
        view.alpha = this.config.alpha;
    }
    public show() {
        this.view.visible = true;
    }
    public hide() {
        this.view.visible = false;
    }
}

/** 场景的黑色背景的控制器 */
export class FullScreenBgCtrl extends BgCtrl {
    constructor(color: string, alpha: number) {
        let width = Laya.stage.width;
        let height = Laya.stage.height;
        super(color, width, height, alpha);
    }
    public update(width, height) {
        let view = this.view;
        let graphics = view.graphics;
        let color = this.config.color;

        this.config.width = width;
        this.config.height = height;

        view.width = width;
        view.height = height;

        graphics.clear();
        graphics.drawRect(0, 0, width, height, color);

        this.updatePos();
    }
    public updatePos() {
        let view = this.view;
        var point = new Laya.Point(0, 0);
        view.localToGlobal(point);
        if (!point || (point.x === 0 && point.y === 0)) {
            return true;
        }
        view.pos(view.x - point.x, view.y - point.y);
    }
    public setPos(pos: Laya.Point) {
        let view = this.view;
        view.x = pos.x;
        view.y = pos.y;
    }
}
