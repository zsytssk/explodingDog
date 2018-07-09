import { PlayerModel } from '../model/player';
import { Link as BaseLink, SeatCtrl } from './seat';
import { CurCardBoxCtrl } from './curCardBox';

export interface Link extends BaseLink {
    btn_chat: Laya.Button;
}

export class CurSeatCtrl extends SeatCtrl {
    protected link: Link;
    private card_box: CurCardBoxCtrl;
    public model: PlayerModel;
    constructor(view: Laya.Node) {
        super(view);
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        super.initLink();
        const view = this.link.view;
        const btn_chat = (view as any).btn_chat;
        this.link.btn_chat = btn_chat;
    }
    protected initEvent() {
        const btn_chat = this.link.btn_chat;
        btn_chat.on(Laya.Event.CLICK, this, () => {});
    }
    public bindModeEvent() {}
}
