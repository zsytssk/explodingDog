import { TopBar } from '../hall/topbarCard';
import { CMD } from '../../data/cmd';
import { popupFadeInEffect, popupFadeOutEffect } from '../../utils/tool';
import { log, getElementsByName } from '../../mcTree/utils/zutil';
import { PopupBuyAvatar } from './popupBuyAvatar';
import { BgCtrl } from '../bgCtrl';

type Link = {
    list: Laya.List;
    btn_back: Laya.Sprite;
    top_bar: TopBar;
};
export class PopupAvatar extends ui.popup.popupAvatarUI {
    public name = 'avatar';
    private link = {} as Link;
    private actions: SailIoAction;
    private mall_avatar: MallAvatarData[];
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
        const { bg } = this;
        const bg_ctrl = new BgCtrl(bg);
        bg_ctrl.init();

        const top_bar = new TopBar();
        top_bar.top = 20;

        this.addChild(top_bar);
        top_bar.setTitle('avatar');

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
            [CMD.GET_AVATAR_LIST]: this.renderData,
            [CMD.CHANGE_AVATAR]: this.changeAvatar,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GET_AVATAR_LIST);

        const { btn_back, list } = this.link;

        btn_back.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.GET_USER_INFO);//更新大厅头像
            Sail.director.closeByName(this.name);
        });

        list.renderHandler = new Laya.Handler(this, (box: Laya.Box, index) => {
            const data_item = this.list.dataSource[index];
            const { is_cur, is_lock, id } = data_item;
            const avatar = getElementsByName(box, 'avatar')[0] as Laya.Image;
            const lock = getElementsByName(box, 'lock')[0] as Laya.Image;
            const is_cur_node = getElementsByName(
                box,
                'is_cur',
            )[0] as Laya.Image;

            lock.visible = is_lock;
            is_cur_node.visible = is_cur;
            avatar.skin = `images/component/avatar/${id}.png`;

            avatar.offAll();
            avatar.on(Laya.Event.CLICK, this, () => {
                this.onClickAction(data_item);
            });
        });
    }

    private onClickAction(data_item) {
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
        if (!cur_mall_item) {
            log('Avatar info error', data_item);
            return;
        }
        Sail.director.popScene(
            new PopupBuyAvatar(cur_mall_item, () => {
                Sail.io.emit(CMD.GET_AVATAR_LIST);
            }),
        );
    }

    private changeAvatar(data, code) {
        if (code !== 200) {
            return;
        }
        const { list } = this.link;
        const data_source = [];
        for (const item of list.dataSource) {
            const { is_lock, id } = item;
            const is_cur = id + '' === data.newAvatar + '';
            data_source.push({
                id,
                is_cur,
                is_lock,
            });
        }

        list.dataSource = data_source;
        list.refresh();
    }

    private renderData(data: GetAvatarListData) {
        const { list } = this.link;
        const { list: avatarList, curAvatar, mallAvatar } = data;
        const data_source = [];
        for (const item of avatarList) {
            const { isLock, avatar } = item;
            const is_cur = avatar + '' === curAvatar + '';
            data_source.push({
                id: avatar,
                is_cur,
                is_lock: isLock,
            });
        }
        list.dataSource = data_source;
        this.mall_avatar = mallAvatar;
    }
}
