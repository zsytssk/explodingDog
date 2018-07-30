import { NodeCtrl } from './node';
interface BgConfig {
    color: string;
    width: number;
    height: number;
    alpha: number;
}

/**
 * 黑色背景的控制器
 */
export class BgCtrl extends NodeCtrl {
    public view: Laya.Sprite;
    protected config: BgConfig;
    constructor(color, width, height, alpha) {
        super(new Laya.Sprite());
        this.config = {
            alpha,
            color,
            height,
            width,
        };
    }
    public init() {
        const view = this.view;
        const graphics = view.graphics;
        const width = this.config.width;
        const height = this.config.height;
        const color = this.config.color;
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
        const width = Laya.stage.width;
        const height = Laya.stage.height;
        super(color, width, height, alpha);
    }
    public update(width, height) {
        const view = this.view;
        const graphics = view.graphics;
        const color = this.config.color;

        this.config.width = width;
        this.config.height = height;

        view.width = width;
        view.height = height;

        graphics.clear();
        graphics.drawRect(0, 0, width, height, color);

        this.updatePos();
    }
    public updatePos() {
        const view = this.view;
        const point = new Laya.Point(0, 0);
        view.localToGlobal(point);
        if (!point || (point.x === 0 && point.y === 0)) {
            return true;
        }
        view.pos(view.x - point.x, view.y - point.y);
    }
    public setPos(pos: Laya.Point) {
        const view = this.view;
        view.x = pos.x;
        view.y = pos.y;
    }
}
