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
        const { view, icon_box } = this.link;
        view.on(Laya.Event.REMOVED, view, () => {
            stopAni(icon_box);
        });
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
}
