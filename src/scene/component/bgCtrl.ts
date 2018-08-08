import { tweenLoop, stopAni } from '../../mcTree/utils/animate';

type bgUI = ui.component.bgUI;
interface Link {
    view: bgUI;
    icon_box: Laya.Image;
}
export class BgCtrl {
    protected link = {} as Link;
    constructor(view) {
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
        this.initMove();
    }
    private initLink() {
        const { view } = this.link;
        const { icon_box } = view;
        this.link = {
            ...this.link,
            icon_box,
        };
    }
    private initEvent() {
        const { view } = this.link;
        view.on(Laya.Event.REMOVED, view, () => {
            this.destroy();
        });

        Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
        this.resize();
    }
    private initMove() {
        const { icon_box } = this.link;
        tweenLoop({
            end_jump: true,
            props_arr: [
                {
                    x: -507,
                },
                {
                    x: 0,
                },
            ],
            sprite: icon_box,
            time: 10000,
        });
    }
    public resize() {
        const { width, height } = Laya.stage;
        const { view } = this.link;
        if (!width) {
            return;
        }
        let scale = (width * 750) / (height * 1334);
        if (scale < 1) {
            scale = 1;
        }
        view.scaleX = scale;
        view.scaleY = scale;
    }
    public destroy() {
        const { icon_box } = this.link;
        stopAni(icon_box);
        Laya.stage.off(Laya.Event.RESIZE, this, this.resize);
    }
}
