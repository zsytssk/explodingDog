import { PlayerModel } from '../model/player';
import { log } from '../../../mcTree/utils/zutil';
import { Link as BaseLink, SeatCtrl } from './seat';
import { CurCardBoxCtrl, CurCardBoxUI } from './cardBox/curCardBox';
import { CardModel } from '../model/card/card';

export interface Link extends BaseLink {
    view: ui.game.seat.curSeatUI;
    btn_chat: Laya.Button;
    card_box_ctrl: CurCardBoxCtrl;
}

export class CurSeatCtrl extends SeatCtrl {
    protected link: Link;
    public model: PlayerModel;
    constructor(view: ui.game.seat.curSeatUI) {
        super(view);
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        super.initLink();
        const view = this.link.view;
        const { player_box, btn_chat } = view;
        this.link.player_box = player_box;
        this.link.btn_chat = btn_chat;
    }
    protected initEvent() {
        super.initEvent();
        const btn_chat = this.link.btn_chat;
        btn_chat.on(Laya.Event.CLICK, this, () => {
            log('chat');
        });
    }
    protected createCardBox(card_box: CurCardBoxUI) {
        const card_box_ctrl = new CurCardBoxCtrl(card_box);
        this.addChild(card_box_ctrl);
        card_box_ctrl.init();
        return card_box_ctrl;
    }
    protected addCard(card: CardModel) {
        this.link.card_box_ctrl.addCard(card);
    }
}
