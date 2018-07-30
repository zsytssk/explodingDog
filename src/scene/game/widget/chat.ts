import { CMD } from "../../../data/cmd";
import { scale_in, scale_out } from "../../../mcTree/utils/animate";

export class ChatCtrl {
    private view: ui.game.widget.chatUI;
    private inited = false;//是否请求过数据
    constructor(chatview: ui.game.widget.chatUI) {
        this.view = chatview;
        this.init();
    }
    init() {
        this.view.on(Laya.Event.CLICK, this, () => {
            scale_out(this.view, 100);
        });
        let chatList = this.view.chatList;
        chatList.cells.forEach((cell, index) => {
            cell.on(Laya.Event.CLICK, this, () => {
                Sail.io.emit(CMD.SEND_CHAT, { id: chatList.array[index].id });
            });
        });
    }
    public loadMsg(list) {
        this.view.chatList.array = list;
        this.inited = true;
    }
    public show() {
        if (!this.inited) {
            Sail.io.emit(CMD.GET_CHAT_LIST);
        }
        scale_in(this.view, 100, 'backOut');
    }
}