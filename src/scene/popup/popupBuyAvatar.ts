import { CMD } from '../../data/cmd';
import { PopupPrompt } from './popupPrompt';

export class PopupBuyAvatar extends ui.popup.buy.buyAvatarUI {
    public name = 'buy_avatar';
    private actions: SailIoAction;
    private item_data = {} as MallAvatarData;
    private sucess_callback: FuncVoid;
    constructor(data: MallAvatarData, callback: FuncVoid) {
        super();
        this.item_data = data;
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
        btn_buy.offAll(Laya.Event.CLICK);
        btn_buy.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(
                new PopupPrompt('是否要购买头像礼包？', () => {
                    const data = this.item_data;
                    Sail.io.emit(CMD.EXCHANGE_GOODS, {
                        itemId: data.itemId,
                        type: 'avatar',
                    });
                }),
            );
        });
    }
    private renderData() {
        const data = this.item_data;
        const { num, avatar_img, cost } = this;
        avatar_img.skin = `images/pop/component/avatar_${data.itemId}.png`;
        num.skin = `images/pop/buy/${data.itemList.length}.png`;
        cost.text = data.perPrice + '';
    }
    private onServerExchangeGoods(data, code, msg) {
        const { sucess_callback } = this;
        if (code !== 200) {
            Sail.director.popScene(new PopupPrompt(msg, () => { }));
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
