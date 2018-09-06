import { log } from './mcTree/utils/zutil';
import { CONFIG } from './data/config';
import { Hall } from './scene/hall/scene';
import { PopupPrompt } from './scene/popup/popupPrompt';
import { PopupCharge } from './scene/popup/popupCharge';
import { PopupShop } from './scene/popup/popupShop';
import { CMD } from './data/cmd';
import { PopupTip } from './scene/popup/popupTip';

export class ErrorManager {
    public checkError(cmd, data, code, errormsg, type) {
        if (cmd == 'io.close' || cmd == 'io.error') {
            let popup = new PopupTip('连接已断开，请刷新游戏。');
            popup.name = 'visible_changed';
            popup.onClosed = () => {
                setTimeout(() => {
                    window.location.reload(true);
                }, 100);
            }
            Sail.director.popScene(popup);
            return false;
        }
        if (cmd == 'conn::init') {
            let popup = Sail.director.getDialogByName('visible_changed');
            if (popup) {
                Sail.director.closeByName('visible_changed');
            }
            return false;
        }
        switch (code) {
            case 10027:
                Sail.director.popScene(
                    new PopupPrompt(errormsg, () => {
                        Sail.director.popScene(new PopupCharge());
                    }),
                );
                return true;
            case 10001:
                const inGame = Sail.director.getRunningScene().name == 'scene_game';
                let pop = new PopupPrompt(errormsg, () => {
                    if (inGame) {
                        CONFIG.need_pop_shop = true;
                        return;
                    }
                    Sail.director.popScene(new PopupShop());
                })
                if (inGame) {
                    pop.onClosed = () => {
                        Sail.director.runScene(new Hall());
                    }
                }
                Sail.director.popScene(pop);
                return true;
        }
        /** 买完东西需要更新余额 */
        if (code === 200 &&
            (cmd === CMD.EXCHANGE_GOODS
                || cmd === CMD.GET_DOG_FOOD
                || cmd === CMD.GET_DAILY_AWARDS
            )) {
            Sail.io.emit(CMD.GET_USER_AMOUNT);
        }
        return false;
    }
}
