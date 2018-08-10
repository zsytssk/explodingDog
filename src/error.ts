import { PopupPrompt } from './scene/popup/popupPrompt';
import { PopupCharge } from './scene/popup/popupCharge';
import { PopupShop } from './scene/popup/popupShop';
import { CMD } from './data/cmd';

export class ErrorManager {
    public checkError(cmd, data, code, errormsg, type) {
        switch (code) {
            case 10027:
                Sail.director.popScene(
                    new PopupPrompt(errormsg, () => {
                        Sail.director.popScene(new PopupCharge());
                    }),
                );
                return true;
            case 10001:
                Sail.director.popScene(
                    new PopupPrompt(errormsg, () => {
                        Sail.director.popScene(new PopupShop());
                    }),
                );
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
