import { CMD } from '../../data/cmd';
import { zutil } from '../utils/zutil';
import { Notify } from '../../utils/notify';
import { NodeCtrl } from '../component/node';

interface i_fishnotice_link {
    text: Laya.Label;
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
    name = 'marquee';
    link: i_fishnotice_link;
    config: t_any_obj;
    constructor(view) {
        super(view);
    }
    init() {
        this.initLink();
        this.onPrimusRecieve(CMD.noticeInTable, data => {
            this.addNotice(data);
        });

        //跑马灯
        this.onPrimusRecieve(CMD.noticeMain, data => {
            if (!data) {
                return;
            }
            this.addNotice(data);
        });

        /**poseidon信息展示 */
        this.on(CMD.noticeInTable, data => {
            this.addNotice(data);
        });
    }
    initLink() {
        let view = this.view;
        let notify_box = zutil.getElementsByName(
            view,
            'notify_box',
        )[0] as Laya.Label;
        let notify = new Notify({
            width: 641,
            fontSize: 20,
            margin: 0,
            tpl: tpl,
            complete: () => {
                this.hide();
            },
        });

        notify.centerY = 0;
        notify_box.addChild(notify);
        this.link.notify = notify;
    }

    addNotice(data) {
        if (!data) {
            return;
        }
        this.show();
        let notify = this.link.notify;

        let checkRepeat = true;
        let count = data.count || 1;
        if (data.count) {
            checkRepeat = false;
        }
        let list = [];
        for (let i = 0; i < count; i++) {
            list.push(data);
        }
        notify.add(list);
    }
}
