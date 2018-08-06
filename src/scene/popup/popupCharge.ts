import { TopBar } from '../hall/topbarCard';
import { CMD } from '../../data/cmd';
import { popupFadeInEffect, popupFadeOutEffect } from '../../utils/tool';
import { log, getElementsByName } from '../../mcTree/utils/zutil';

type Link = {
    list: Laya.List;
    btn_back: Laya.Sprite;
    top_bar: TopBar;
};
export class PopupCharge extends ui.popup.popupChargeUI {
    public name = 'charge';
    private link = {} as Link;
    private actions: SailIoAction;
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
        const top_bar = new TopBar();
        top_bar.top = 20;

        this.addChild(top_bar);
        top_bar.setTitle('charge');

        const { btnBack: btn_back } = top_bar;

        const { list } = this;

        this.link = {
            ...this.link,
            btn_back,
            list,
            top_bar,
        };
    }

    private initEvent() {
        this.actions = {
            [CMD.GET_MALL_LIST]: this.renderData,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GET_MALL_LIST, { type: 'bone' });

        const { btn_back, list } = this.link;

        btn_back.on(Laya.Event.CLICK, this, () => {
            Sail.director.closeByName(this.name);
        });

        list.renderHandler = new Laya.Handler(this, (box: Laya.Box, index) => {
            const data_item = this.list.dataSource[index];
            const { is_first, give, buy_num, cost } = data_item;
            const img_bone = getElementsByName(box, 'img_bone')[0] as Laya.Image;
            const buy_num_node = getElementsByName(box, 'buy_num')[0] as Laya.Text;
            const btn_cost = getElementsByName(box, 'btn_cost')[0] as Laya.Image;
            const cost_node = getElementsByName(btn_cost, 'cost')[0] as Laya.Text;
            const shadow = getElementsByName(box, 'shadow')[0] as Laya.Text;
            const tag_give = getElementsByName(box, 'tag_give')[0] as Laya.Image;
            const tag_first_give = getElementsByName(box, 'tag_first_give')[0] as Laya.Image;

            let cur_give_node, give_num;
            if (is_first) {
                tag_first_give.visible = true;
                tag_give.visible = false;
                cur_give_node = tag_first_give;
                give_num = give.first;
            } else {
                tag_first_give.visible = false;
                tag_give.visible = true;
                cur_give_node = tag_give;
                give_num = give.normal;
            }
            const give_num_node = getElementsByName(cur_give_node, 'give_num')[0] as Laya.Text;
            give_num_node.text = give_num;
            buy_num_node.text = `${buy_num}骨头`;

            img_bone.skin = `images/pop/charge/bone${index + 1}.png`;
            cost_node.text = `￥${cost}`;
            shadow.width = 130 + (index - 1) * 20;

            btn_cost.offAll();
            btn_cost.on(Laya.Event.CLICK, this, () => {
                log('------', data_item);
                //this.onClickAction(data_item);
            });
        });
    }

    private onClickAction(data_item) {
        log(data_item, this.mall_avatar);
        const { is_cur, is_lock, id } = data_item;
        if (is_cur) {
            return;
        }
        if (!is_lock) {
            Sail.io.emit(CMD.CHANGE_AVATAR, { avatar: id });
            return;
        }
        let cur_mall_item;
        for (const item of this.mall_avatar) {
            if (item.itemList.indexOf(parseInt(id, 10)) !== -1) {
                cur_mall_item = item;
                break;
            }
        }
        Sail.director.popScene(
            new PopupBuyAvatar(cur_mall_item, () => {
                Sail.io.emit(CMD.GET_AVATAR_LIST);
            }),
        );
    }

    private renderData(data: GetChargeData) {
        log('==========', data);
        const { list } = this.link;
        const { boneList } = data;
        const data_source = [];
        for (const item of boneList) {
            const { rmb, num, isFirst, give } = item;
            data_source.push({
                buy_num: num,
                cost: rmb,
                is_first: isFirst,
                give,
            });
        }
        list.dataSource = data_source;
    }
}
