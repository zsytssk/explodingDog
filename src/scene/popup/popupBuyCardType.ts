import { CMD } from '../../data/cmd';
import { PopupPrompt } from './popupPrompt';
import { nameMap } from '../../mcTree/utils/zutil';

type Type = 'dance' | 'crazy';
type Data = {
    card_type: string;
    sucess_callback: FuncVoid;
};
const type_map = {
    1: {
        en: 'dance',
        zh: '乱舞',
    },
    2: {
        en: 'crazy',
        zh: '疯狂',
    },
};
export class PopupBuyCardType extends ui.popup.buy.buyCardTypeUI {
    public name = 'buy_card_type';
    private actions: SailIoAction;
    private sucess_callback: FuncVoid;
    private type_id: string;
    constructor(type_id: string, callback: FuncVoid) {
        super();
        this.type_id = type_id;
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

        const { btn_buy } = this;
        btn_buy.offAll();
        btn_buy.on(Laya.Event.CLICK, this, () => {
            const str = `是否要购买${type_map[this.type_id].zh}扩展包？`;
            Sail.director.popScene(
                new PopupPrompt(str, () => {
                    Sail.io.emit(CMD.EXCHANGE_GOODS, {
                        itemId: this.type_id,
                        type: 'cards',
                    });
                }),
            );
        });
    }
    private renderData() {
        const { type_id, content, title } = this;
        const type_str = type_map[this.type_id].en;
        title.skin = `images/pop/buy/${type_str}_title.png`;
        content.skin = `images/pop/buy/${type_str}.png`;
    }
    private onServerExchangeGoods(data, code, msg) {
        const { sucess_callback } = this;
        if (code !== 200) {
            Sail.director.popScene(new PopupPrompt(msg, () => {}));
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

nameMap(['PopupBuyCardType'], null, PopupBuyCardType);
