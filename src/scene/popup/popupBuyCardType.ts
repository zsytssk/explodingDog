import { CMD } from '../../data/cmd';
import { PopupPrompt } from './popupPrompt';
import { nameMap, log } from '../../mcTree/utils/zutil';

type Data = {
    card_id: string;
    price: number;
    is_buy: boolean;
    unLockLevel: number;
};
const type_map = {
    2003: {
        en: 'dance',
        zh: '乱舞',
    },
    2002: {
        en: 'crazy',
        zh: '疯狂',
    },
};
export class PopupBuyCardType extends ui.popup.buy.buyCardTypeUI {
    public name = 'buy_card_type';
    private actions: SailIoAction;
    private sucess_callback: FuncVoid;
    private data: Data;
    constructor(data: Data, callback: FuncVoid) {
        super();
        this.data = data;
        this.sucess_callback = callback;
        this.init();
    }

    private init() {
        this.initEvent();
        this.renderData();
    }
    private initEvent() {
        this.actions = {
            [CMD.EXCHANGE_GOODS]: this.onServerExchangeGoods,
        };
        Sail.io.register(this.actions, this);

        const { btn_buy, data } = this;
        btn_buy.offAll();
        btn_buy.on(Laya.Event.CLICK, this, () => {
            const str = `是否要购买${type_map[data.card_id].zh}扩展包？`;
            Sail.director.popScene(
                new PopupPrompt(str, () => {
                    Sail.io.emit(CMD.EXCHANGE_GOODS, {
                        itemId: data.card_id,
                        type: 'cards',
                    });
                }),
            );
        });
    }
    private renderData() {
        const {
            data,
            content,
            title,
            cost,
            btn_buy,
            buy_sucess,
            intro_box,
            levelLabel,
            levelPanel
        } = this;
        const { card_id, price, is_buy, unLockLevel } = data;
        const type_str = type_map[card_id].en;
        title.skin = `images/pop/buy/${type_str}_title.png`;
        content.skin = `images/pop/buy/${type_str}.png`;
        cost.text = price + '';
        if (unLockLevel != 0) {
            levelLabel.text = unLockLevel.toString();
        } else {
            levelPanel.visible = false;
        }
        if (is_buy) {
            btn_buy.visible = false;
            buy_sucess.visible = true;
        }
        Laya.timer.frameOnce(30, this, () => {
            intro_box.height = content.height;
            log(content.height);
        });
    }
    private onServerExchangeGoods(data, code, msg) {
        const { sucess_callback } = this;
        if (code !== 200) {
            Sail.director.popScene(new PopupPrompt(msg));
            return;
        }
        if (sucess_callback) {
            sucess_callback();
        }
        this.close();
    }
    public destroy() {
        this.sucess_callback = undefined;
        Sail.io.unregister(this.actions);
        super.destroy();
    }
}
