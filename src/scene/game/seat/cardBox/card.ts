import { cmd as base_cmd } from '../../../../mcTree/event';
import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import {
    CardModel,
    cmd as card_cmd,
    BlindStatus,
    AnnoyStatus,
} from '../../model/card/card';
import { ActionSendData } from '../../model/card/action';
import { getCardInfo, convertPos, stopSkeleton } from '../../../../utils/tool';
import { tween, setStyle } from '../../../../mcTree/utils/animate';
import { CMD } from '../../../../data/cmd';
import { CardBoxCtrl } from './cardBox';

type CardView = ui.game.seat.cardBox.cardUI;
export interface Link {
    card_box: CardBoxCtrl;
    view: CardView;
    wrap: Laya.Sprite;
    blind: Laya.Sprite;
    annoy: Laya.Sprite;
    card_light: Laya.Skeleton;
}

const card_height = 238;
export const space_scale = 1 / 2;
export class CardCtrl extends BaseCtrl {
    public name = 'card';
    protected link = {} as Link;
    protected is_insert: boolean;
    protected is_copy_face: boolean;
    protected model: CardModel;
    /** 是否被选中, 用于处理card_box sort 要不要处理 */
    public is_selected = false;
    /** 牌需要缩小的比例， 所有的牌都使用一个ui， 需要根据父类的高度去做缩小 */
    protected scale: number;
    constructor(model: CardModel, wrap: Laya.Sprite, is_insert?: boolean) {
        super();
        this.model = model;
        this.is_insert = is_insert;
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        this.initUI();

        const { view, wrap } = this.link;
        const { card_light } = view;

        stopSkeleton(card_light);
        this.link = {
            ...this.link,
            card_box: this.parent as CardBoxCtrl,
            card_light,
        };
    }
    /** 初始化ui， 设置当前其他玩家牌的样式（大小 显示牌背面） */
    private initUI() {
        const { wrap } = this.link;
        const view = new ui.game.seat.cardBox.cardUI();
        const { blind, annoy } = view;
        const scale = wrap.height / view.height;

        if (this.is_insert) {
            view.visible = false;
        }
        wrap.addChild(view);
        setStyle(view, {
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: scale,
            scaleY: scale,
        });
        this.link = {
            annoy,
            blind,
            view,
            ...this.link,
        };
        this.scale = scale;
        this.drawCard();
    }
    public setStyle(props: AnyObj) {
        const { view } = this.link;
        setStyle(view, {
            ...props,
        });
    }
    /** 设置牌的样式 */
    public drawCard() {
        const { card_id, is_blind, is_beannoyed } = this.model;
        const { view } = this.link;
        const card_info = getCardInfo(card_id);
        const { card_id: view_card_id, card_face, card_back } = view;
        if (card_info) {
            card_face.skin = card_info.url;
            view_card_id.text = `id:${card_id}`;
            card_back.visible = false;
        } else {
            card_back.visible = true;
        }

        this.setBlindStatus({ is_blind });
        this.setAnnoyStatus({ is_beannoyed });
    }
    protected initEvent() {
        this.onModel(base_cmd.destroy, () => {
            this.destroy();
        });
        this.onModel(card_cmd.discard, () => {
            this.discard();
        });
        this.onModel(card_cmd.blind_status, (data: BlindStatus) => {
            this.setBlindStatus(data);
        });
        this.onModel(card_cmd.annoy_status, (data: AnnoyStatus) => {
            this.setAnnoyStatus(data);
        });
        this.onModel(card_cmd.give, () => {
            this.give();
        });
        this.onModel(card_cmd.action_send, (data: ActionSendData) => {
            Sail.io.emit(CMD.HIT, {
                hitCard: this.model.card_id,
                hitParams: data,
            } as HitBackData);
        });
        this.onModel(card_cmd.update_info, () => {
            this.drawCard();
        });
    }
    private setBlindStatus(data: BlindStatus) {
        const { is_blind } = data;
        const { blind } = this.link;
        blind.visible = is_blind;
    }
    private setAnnoyStatus(data: AnnoyStatus) {
        const { is_beannoyed } = data;
        const { annoy } = this.link;
        annoy.visible = is_beannoyed;
    }
    public getCardId() {
        return this.model.card_id;
    }
    /** 获取牌的大小 边距， CurCardBox滑动需要数据 */
    public getCardBound() {
        const { view } = this.link;
        const { scale } = this;
        const width = view.width * scale;
        const space = width * space_scale;
        return {
            space,
            width,
        };
    }
    protected discard() {
        const { card_box } = this.link;
        card_box.discardCard(this);
    }
    /** 其他用户的牌在被给出时直接销毁 */
    protected give() {
        const { card_box } = this.link;
        card_box.removeCard(this);
        this.destroy();
    }
    /** 将牌放到game中的animate_box中飞行到特定的位置， 在放到牌堆中 */
    public putCardInWrap(wrap: Laya.Sprite) {
        this.is_selected = false;
        const { view, card_box } = this.link;
        const card_move_box = card_box.getCardMoveBox();

        const scale = wrap.height / card_height;
        const card_pos = new Laya.Point(view.width / 2, view.height / 2);
        const wrap_pos = new Laya.Point(wrap.width / 2, wrap.height / 2);
        convertPos(card_pos, view, card_move_box);
        convertPos(wrap_pos, wrap, card_move_box);

        card_move_box.addChild(view);
        view.pos(card_pos.x, card_pos.y);

        this.link.card_box = undefined;
        this.link.wrap = wrap;

        return tween({
            end_props: {
                scaleX: scale,
                scaleY: scale,
                x: wrap_pos.x,
                y: wrap_pos.y,
            },
            sprite: view,
        }).then(() => {
            this.scale = scale;
            wrap.addChild(view);
            view.pos(wrap.width / 2, wrap.height / 2);
        });
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { view, card_light } = this.link;
        const { scale, is_copy_face } = this;
        const space = view.width * scale * space_scale;
        let time = 200;
        const { x, y } = {
            x: (view.width * scale) / 2 + space * index,
            y: (view.height * scale) / 2,
        };

        let end_props = { y, x } as AnyObj;

        if (this.is_insert) {
            if (!is_copy_face) {
                view.x = x;
            } else {
                time = 700;
            }
            end_props = {
                ...end_props,
                scaleX: scale,
                scaleY: scale,
            };
            this.is_copy_face = false;
            view.visible = true;
            this.is_insert = false;
        }
        view.zOrder = index;
        tween({
            end_props,
            sprite: view,
            time,
        }).then(() => {
            stopSkeleton(card_light);
            card_light.visible = false;
        });
    }
    public destroy() {
        const { view } = this.link;
        view.destroy();

        super.destroy();
    }
}
