import { log } from './../../mcTree/utils/zutil';
import { TopBar } from '../hall/topbarCard';
import { getElementsByName } from '../../mcTree/utils/zutil';
import { CMD } from '../../data/cmd';
import { CardPackShop } from './component/cardPackBaseShop';
import { popupFadeInEffect, popupFadeOutEffect } from '../../utils/tool';
import { PopupPrompt } from './popupPrompt';
import { BgCtrl } from '../component/bgCtrl';

type Link = {
    tab: Laya.Tab;
    main_stack: Laya.ViewStack;
    topbar: TopBar;
    btn_back: Laya.Sprite;
    stamina_list: Laya.List;
    avatar_list: Laya.List;
    card_type_list: Laya.List;
    card_type_box: Laya.Box;
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

export class PopupShop extends ui.popup.popupShopUI {
    public name = 'shop';
    public group = 'shop';
    private link = {} as Link;
    private actions: SailIoAction;
    public CONFIG = {
        closeOnSide: true,
        closeByGroup: true
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
            avatar_list,
            card_type_list,
        } = this;

        this.link = {
            ...this.link,
            avatar_list,
            btn_back,
            card_type_list,
            main_stack,
            stamina_list,
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
        Sail.io.emit(CMD.GET_MALL_LIST, { type: 'shop' });

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

        stamina_list.dataSource = [];
        stamina_list.vScrollBarSkin = '';
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
                let buyStamina = () => {
                    Sail.director.popScene(
                        new PopupPrompt(
                            `是否要购买${data_item.buy_num}体力值？`,
                            () => {
                                Sail.io.emit(CMD.EXCHANGE_GOODS, {
                                    itemId: data_item.id,
                                    type: 'stamina',
                                });
                            },
                        ),
                    );
                }
                box.off(Laya.Event.MOUSE_DOWN, this, buyStamina);
                box.on(Laya.Event.MOUSE_DOWN, this, buyStamina);
            },
        );

        avatar_list.dataSource = [];
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
                const avatar_name = getElementsByName(
                    box,
                    'name',
                )[0] as Laya.Label;
                avatar_name.text = '头像礼盒' + (index + 1);
                avatar_img.skin = `images/pop/component/avatar_${id}.png`;
                if (is_buy) {
                    log(1111111111)
                    btn_buy.visible = false;
                    btn_success.visible = true;
                    box.offAll();
                    return;
                }
                const cost = getElementsByName(box, 'cost')[0] as Laya.Text;
                cost.text = data_item.cost;
                let buyAvatar = () => {
                    Sail.director.popScene(
                        new PopupPrompt('是否要购买头像礼包？', () => {
                            Sail.io.emit(CMD.EXCHANGE_GOODS, {
                                itemId: id,
                                type: 'avatar',
                            });
                        }),
                    );
                }
                box.off(Laya.Event.MOUSE_DOWN, this, buyAvatar);
                box.on(Laya.Event.MOUSE_DOWN, this, buyAvatar);
            },
        );

        card_type_list.dataSource = [];
        card_type_list.renderHandler = new Laya.Handler(
            this,
            (box: Laya.Box, index) => {
                const data_item = card_type_list.dataSource[index];
                box.removeChildren();
                box.addChild(new CardPackShop(data_item));
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
        if (data.type !== 'shop') {
            return;
        }
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
                is_buy: avatar_item.purchased,
                item_list: avatar_item.itemList,
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
                unLockLevel
            } = card_data;
            card_type_data.push({
                card_id,
                is_buy,
                price,
                type,
                unLockLevel
            });
        }
        card_type_list.dataSource = card_type_data;
    }
    public destroy() {
        super.destroy();
        Sail.io.unregister(this.actions);
    }
}
