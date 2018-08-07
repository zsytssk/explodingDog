import { TopBar } from '../hall/topbarCard';
import { log, getElementsByName } from '../../mcTree/utils/zutil';
import { CMD } from '../../data/cmd';
import { CardPackShop } from './component/cardPackBaseShop';
import { popupFadeInEffect, popupFadeOutEffect } from '../../utils/tool';
import { PopupPrompt } from './popupPrompt';
import { BgCtrl } from '../bgCtrl';

type Link = {
    tab: Laya.Tab;
    main_stack: Laya.ViewStack;
    topbar: TopBar;
    btn_back: Laya.Sprite;
    stamina_list: Laya.List;
    avatar_list: Laya.List;
    card_type_list: Laya.List;
    card_type_box: Laya.Box;
    avatar_box: Laya.Box;
};

type StaminaData = {
    buy_num?: number;
    is_buy?: number;
    cost: number;
    id: number;
};
type AvatarData = PartialAll<
    StaminaData,
    {
        item_list: number[];
    }
    >;

const card_type_pos = [
    {
        x: 80,
        y: 16,
    },
    {
        x: 551,
        y: 16,
    },
];

export class PopupShop extends ui.popup.popupShopUI {
    public name = 'shop';
    private link = {} as Link;
    private actions: SailIoAction;
    public CONFIG = {
        closeOnSide: true,
    };
    constructor() {
        super();
        this.init();
        this.popupEffect = popupFadeInEffect(this);
        this.closeEffect = popupFadeOutEffect(this);
    }
    private init() {
        this.initLink();
        this.initEvent();
    }
    private initLink() {
        const topbar = new TopBar();
        topbar.top = 20;

        this.addChild(topbar);
        topbar.setTitle('shop');

        const { bg } = this;
        const bg_ctrl = new BgCtrl(bg);
        bg_ctrl.init();

        const { btnBack: btn_back } = topbar;

        const {
            tab,
            main_stack,
            stamina_list,
            avatar_box,
            avatar_list,
            card_type_list,
        } = this;

        this.link = {
            ...this.link,
            avatar_box,
            avatar_list,
            btn_back,
            main_stack,
            stamina_list,
            card_type_list,
            tab,
            topbar,
        };
    }
    private initEvent() {
        this.actions = {
            [CMD.GET_MALL_LIST]: this.renderData,
            [CMD.EXCHANGE_GOODS]: this.exchangeGoods,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GET_MALL_LIST);

        const {
            tab,
            main_stack,
            btn_back,
            stamina_list,
            avatar_list,
            card_type_list,
        } = this.link;
        tab.selectHandler = new Laya.Handler(this, index => {
            for (let i = 0; i < tab.numChildren; i++) {
                const tab_item = tab.getChildAt(i);
                const overlay = tab_item.getChildAt(0) as Laya.Sprite;
                if (i === index) {
                    overlay.visible = false;
                } else {
                    overlay.visible = true;
                }
            }
            main_stack.selectedIndex = index;
        });
        tab.selectedIndex = 0;

        btn_back.on(Laya.Event.CLICK, this, () => {
            Sail.director.closeByName(this.name);
        });

        stamina_list.renderHandler = new Laya.Handler(
            this,
            (box: Laya.Box, index) => {
                const data_item = stamina_list.dataSource[index];
                const buy_num = getElementsByName(
                    box,
                    'buy_num',
                )[0] as Laya.Text;
                const btn_buy = getElementsByName(
                    box,
                    'btn_buy',
                )[0] as Laya.Text;
                const cost = getElementsByName(box, 'cost')[0] as Laya.Text;
                buy_num.text = data_item.buy_num + '体力';
                cost.text = data_item.cost;
                btn_buy.offAll();
                btn_buy.on(Laya.Event.CLICK, this, () => {
                    Sail.director.popScene(
                        new PopupPrompt(`是否要购买${data_item.buy_num}体力值？`, () => {
                            Sail.io.emit(CMD.EXCHANGE_GOODS, {
                                type: 'stamina',
                                itemId: data_item.id
                            });
                        }),
                    );
                });
            },
        );
        avatar_list.renderHandler = new Laya.Handler(
            this,
            (box: Laya.Box, index) => {
                const data_item = avatar_list.dataSource[index];
                const { is_buy, id } = data_item;
                const avatar_img = getElementsByName(
                    box,
                    'avatar_img',
                )[0] as Laya.Image;
                const btn_buy = getElementsByName(
                    box,
                    'btn_buy',
                )[0] as Laya.Text;
                const btn_success = getElementsByName(
                    box,
                    'btn_success',
                )[0] as Laya.Image;
                if (is_buy) {
                    btn_buy.visible = false;
                    btn_success.visible = true;
                    return;
                }
                const cost = getElementsByName(box, 'cost')[0] as Laya.Text;
                cost.text = data_item.cost;
                avatar_img.skin = `images/pop/component/avatar_${id}.png`;
                btn_buy.offAll();
                btn_buy.on(Laya.Event.CLICK, this, () => {
                    Sail.director.popScene(
                        new PopupPrompt('是否要购买头像礼包？', () => {
                            Sail.io.emit(CMD.EXCHANGE_GOODS, {
                                type: 'avatar',
                                itemId: id
                            });
                        }),
                    );
                });
            },
        );

        card_type_list.renderHandler = new Laya.Handler(
            this,
            (box: Laya.Box, index) => {
                const data_item = card_type_list.dataSource[index];
                box.removeChildren();
                box.addChild(new CardPackShop(data_item))
            },
        );
    }
    private exchangeGoods(data, code) {
        if (code !== 200) {
            return;
        }
        const { card_type_list, avatar_list } = this.link;
        const { type, itemId } = data;
        if (type === 'avatar') {
            for (const avatar_item of avatar_list.dataSource) {
                if (itemId + '' === avatar_item.id + '') {
                    avatar_item.is_buy = 1;
                }
            }
            avatar_list.refresh();
        } else if (type === 'cards') {
            for (const item of card_type_list.dataSource) {
                if (itemId + '' === item.card_id + '') {
                    item.is_buy = 1;
                }
            }
            card_type_list.refresh();
        }
    }
    private renderData(data: GetMAllData) {
        const { stamina_list, card_type_list, avatar_list } = this.link;
        const { stamina, cards, avatar } = data.data;
        const stamina_data = [] as StaminaData[];
        for (const stamina_item of stamina) {
            stamina_data.push({
                buy_num: stamina_item.itemList,
                cost: stamina_item.perPrice,
                id: stamina_item.itemId,
            });
        }
        stamina_list.dataSource = stamina_data;

        const avatar_data = [] as AvatarData[];
        for (const avatar_item of avatar) {
            avatar_data.push({
                cost: avatar_item.perPrice,
                id: avatar_item.itemId,
                item_list: avatar_item.itemList,
                is_buy: avatar_item.purchased,
            });
        }
        avatar_list.dataSource = avatar_data;

        const card_type_data = [];
        for (const card_data of cards) {
            const {
                perPrice: price,
                itemList: type,
                itemId: card_id,
                purchased: is_buy,
            } = card_data;
            card_type_data.push({
                card_id,
                price,
                type,
                is_buy,
            });
        }
        card_type_list.dataSource = card_type_data;
    }
    public destroy() {
        super.destroy();
        Sail.io.unregister(this.actions);
    }
}
