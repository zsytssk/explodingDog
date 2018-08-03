import { TopBar } from '../hall/topbarCard';
import { log, getElementsByName } from '../../mcTree/utils/zutil';
import { CMD } from '../../data/cmd';
import { CardPackShop } from './component/cardPackBaseShop';
import { popupFadeInEffect, popupFadeOutEffect } from '../../utils/tool';
type Link = {
    tab: Laya.Tab;
    main_stack: Laya.ViewStack;
    topbar: TopBar;
    btn_back: Laya.Sprite;
    stamina_list: Laya.List;
    avatar_list: Laya.List;
    card_type_box: Laya.Box;
    avatar_box: Laya.Box;
};

type StaminaData = {
    buy_num?: number;
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

        const { btnBack: btn_back } = topbar;

        const {
            tab,
            main_stack,
            stamina_list,
            card_type_box,
            avatar_box,
            avatar_list,
        } = this;

        this.link = {
            ...this.link,
            avatar_box,
            avatar_list,
            btn_back,
            card_type_box,
            main_stack,
            stamina_list,
            tab,
            topbar,
        };
    }
    private initEvent() {
        this.actions = {
            [CMD.GET_MALL_LIST]: this.renderData,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GET_MALL_LIST);

        const {
            tab,
            main_stack,
            btn_back,
            stamina_list,
            avatar_list,
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
                cost.text = '￥' + data_item.cost;
                btn_buy.offAll();
                btn_buy.on(Laya.Event.CLICK, this, () => {
                    log(data_item);
                });
            },
        );
        avatar_list.renderHandler = new Laya.Handler(
            this,
            (box: Laya.Box, index) => {
                const data_item = avatar_list.dataSource[index];
                const avatar_img = getElementsByName(
                    box,
                    'avatar_img',
                )[0] as Laya.Image;
                const btn_buy = getElementsByName(
                    box,
                    'btn_buy',
                )[0] as Laya.Text;
                const cost = getElementsByName(box, 'cost')[0] as Laya.Text;
                cost.text = '￥' + data_item.cost;
                avatar_img.skin = `images/pop/component/avatar_${
                    data_item.id
                }.png`;
                btn_buy.on(Laya.Event.CLICK, this, () => {
                    log(data_item);
                });
            },
        );
    }
    private renderData(data: GetMAllData) {
        const { stamina_list, card_type_box, avatar_list } = this.link;
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
            });
        }
        avatar_list.dataSource = avatar_data;

        card_type_box.removeChildren();
        for (const card_data of cards) {
            const {
                perPrice: price,
                itemList: type,
                itemId: card_id,
            } = card_data;
            const card_type_item = new CardPackShop({
                card_id,
                price,
                type,
            });
            card_type_box.addChild(card_type_item);
            const pos = card_type_pos[type - 2];
            card_type_item.pos(pos.x, pos.y);
        }
    }
    public destroy() {
        super.destroy();
        Sail.io.unregister(this.actions);
    }
}
