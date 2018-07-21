import { getElementsByName } from '../../mcTree/utils/zutil';
import { CMD } from '../../data/cmd';

export class PopupJoinRoom extends ui.popup.popupJoinRoomUI {
    private roomId: string;
    constructor() {
        super();
        this.init();
    }
    init() {
        this.roomId = '';
        this.initEvent();
    }
    initEvent() {
        const numButtons = getElementsByName(this, 'btnNum');
        numButtons.forEach(numButton => {
            numButton.on(Laya.Event.CLICK, this, () => {
                this.insertNum(numButton.label);
            });
        });
        this.btnDelete.on(Laya.Event.CLICK, this, () => {
            this.deleteNum();
        });
        this.btnJoin.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.JOIN_ROOM, {
                roomId: this.roomId,
                type: 'fixed',
            });
        });
    }

    insertNum(num) {
        if (isNaN(num) || this.roomId.length >= 6) {
            return;
        }
        this.roomId += num;
        if (this.roomId.length == 3) {
            this.inputLabel.text += `${num} `;
        } else {
            this.inputLabel.text += num;
        }
    }

    deleteNum() {
        if (this.roomId == '') {
            return;
        }
        this.roomId = this.roomId.substr(0, this.roomId.length - 1);
        let text = this.inputLabel.text;
        if (text.length == 4) {
            this.inputLabel.text = text.substr(0, text.length - 2);
        } else {
            this.inputLabel.text = text.substr(0, text.length - 1);
        }
    }
}
