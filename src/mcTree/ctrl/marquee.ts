import * as zutil from '../utils/zutil';
import { Notify } from '../utils/notify';
import { NodeCtrl } from './node';

interface Link {
    text: Laya.Label;
    view: Laya.Sprite;
    notify: Notify;
}

const tpl = `
    {{if list}}
        {{each list}}
        <span color='{{if $value.color}}{{$value.color}}{{else}}#ffffff{{/if}}'>{{$value.content}}</span>
        {{/each}}
    {{else}}
        <span color='#ffffff'>{{content}}</span>
    {{/if}}
`;

/** 跑马灯的控制器 */
export class MarqueeCtrl extends NodeCtrl {
    public name = 'marquee';
    protected link: Link;
    protected config: AnyObj;
    constructor(view) {
        super(view);
        this.link = {
            view,
        } as Link;
    }
    public init() {
        this.initLink();
    }
    private initLink() {
        const { view } = this.link;
        const notify_box = zutil.getElementsByName(
            view,
            'notify_box',
        )[0] as Laya.Label;
        const notify = new Notify({
            complete: () => {
                this.hide();
            },
            fontSize: 20,
            margin: 0,
            tpl,
            width: 641,
        });

        notify.centerY = 0;
        notify_box.addChild(notify);
        this.link.notify = notify;
    }

    public addNotice(data) {
        if (!data) {
            return;
        }
        this.show();
        const notify = this.link.notify;

        const count = data.count || 1;
        const list = [];
        for (let i = 0; i < count; i++) {
            list.push(data);
        }
        notify.add(list);
    }
}
