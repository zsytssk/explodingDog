import { TopBar } from '../hall/topbarCard';
import { CMD } from '../../data/cmd';
import { popupFadeInEffect, popupFadeOutEffect } from '../../utils/tool';
import { log, getElementsByName } from '../../mcTree/utils/zutil';

export class PopupAvatar extends ui.popup.popupAvatarUI {
    public name = 'avatar';
    private top_bar: TopBar;
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
        const top_bar = new TopBar();
        top_bar.top = 20;

        this.addChild(top_bar);
        top_bar.setTitle('avatar');
        this.top_bar = top_bar;

        const { btnBack: btn_back } = top_bar;

        const {
            list,
        } = this;

        this.link = {
            ...this.link,
            list,
            btn_back,
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
            Sail.director.closeByName(this.name);
        });

        list.renderHandler = new Laya.Handler(
            this,
            (box: Laya.Box, index) => {
                const data_item = this.list.dataSource[index];
                const { is_cur, is_lock, id } = data_item;
                const avatar = getElementsByName(
                    box,
                    'avatar',
                )[0] as Laya.Image;
                const lock = getElementsByName(
                    box,
                    'lock',
                )[0] as Laya.Image;
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
            },
        );
    }

    private onClickAction(data_item) {
        console.log(data_item, this.mall_avatar);
        const { is_cur, is_lock, id } = data_item;
        if (is_cur) {
            return;
        }
        if (!is_lock) {
            Sail.io.emit(CMD.CHANGE_AVATAR, { avatar: id });
            return;
        }
        console.log('----buy');
        let cur_mall_item;
        for (let item of this.mall_avatar) {
            if (item.itemList.indexOf(parseInt(id))) {
                cur_mall_item = item;
                break;
            }
        }
        console.log('----------cur_mall_item: ', cur_mall_item, id);

    }

    private changeAvatar(data, code) {
        if (code != '200') {
            return;
        }
        const { list } = this.link;
        const data_source = [];
        for (let item of list.dataSource) {
            let { is_lock, id } = item;
            const is_cur = id == data.newAvatar;
            data_source.push({
                is_lock,
                is_cur,
                id,
            })
        }

        list.dataSource = data_source;
        list.refresh();
    }

    private renderData(data: GetAvatarListData) {
        const { list } = this.link;
        const { list: avatarList, curAvatar, mallAvatar } = data;
        const data_source = [];
        for (let item of avatarList) {
            let { isLock, avatar } = item;
            const is_cur = avatar == curAvatar;
            data_source.push({
                is_lock: isLock,
                is_cur,
                id: avatar,
            })
        }
        list.dataSource = data_source;
        this.mall_avatar = mallAvatar;
    }
}
