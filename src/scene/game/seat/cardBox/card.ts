import { CMD } from '../../../../data/cmd';
import { cmd as base_cmd } from '../../../../mcTree/event';
import { tween } from '../../../../mcTree/utils/animate';
import {
    convertPos,
    degreeToAngle,
    stopSkeleton,
} from '../../../../utils/tool';
import { ActionSendData } from '../../model/card/action';
import {
    AnnoyStatus,
    BlindStatus,
    CardModel,
    cmd as card_cmd,
} from '../../model/card/card';
import { CardFrom } from '../../model/player';
import { CardBaseCtrl, Link as BaseLink } from './cardBase';
import { CardBoxCtrl } from './cardBox';

export interface Link extends BaseLink {
    card_box: CardBoxCtrl;
    blind: Laya.Sprite;
    annoy: Laya.Sprite;
}

const card_height = 238;
export const space_scale = 1 / 2;
export class CardCtrl extends CardBaseCtrl {
    public name = 'card';
    protected link: Link;
    /** 是否是插入的牌, 用来处理插入牌 插入动作慢于在牌堆里的牌 */
    protected slow_move: boolean;
    protected model: CardModel;
    /** 是否被拖动出牌堆, 用于处理card_box sort 要不要处理,  */
    public is_selected = false;
    constructor(model: CardModel, wrap: Laya.Sprite, from?: CardFrom) {
        super(model.card_id, wrap);
        this.model = model;
        if (from && from !== 'cards') {
            this.slow_move = true;
        }
        this.link.wrap = wrap;
    }
    public init() {
        super.init();
        this.initEvent();
    }
    protected initLink() {
        super.initLink();
        this.link = {
            ...this.link,
            card_box: this.parent as CardBoxCtrl,
        };
    }
    protected initUI() {
        super.initUI();
        const { view } = this.link;
        const { blind, annoy } = view;
        this.link = {
            ...this.link,
            annoy,
            blind,
            card_box: this.parent as CardBoxCtrl,
        };
    }
    /** 设置牌的样式 */
    public drawCard() {
        const { card_id, is_blind, be_annoyed } = this.model;
        super.setCardId(card_id);
        super.drawCard();
        this.setBlindStatus({ is_blind });
        this.setAnnoyStatus({ be_annoyed });
    }
    protected initEvent() {
        this.onModel(base_cmd.destroy, () => {
            this.destroy();
        });
        this.onModel(card_cmd.blind_status, (data: BlindStatus) => {
            this.setBlindStatus(data);
        });
        this.onModel(card_cmd.annoy_status, (data: AnnoyStatus) => {
            this.setAnnoyStatus(data);
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
        const { be_annoyed } = data;
        const { annoy } = this.link;
        annoy.visible = be_annoyed;
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
    public isCardModel(card_model: CardModel) {
        return this.model === card_model;
    }
    public resetStyle() {
        const { view } = this.link;
        view.zOrder = 0;
    }
    /** 将牌放到game中的animate_box中飞行到特定的位置， 在放到牌堆中 */
    public putCardInWrap(wrap: Laya.Sprite, no_time?: boolean) {
        this.is_selected = false;
        const { view, card_box } = this.link;
        const card_move_box = card_box.getCardMoveBox();
        let time = 300;
        if (no_time) {
            time = 0;
        }
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
                rotation: 0,
                scaleX: scale,
                scaleY: scale,
                x: wrap_pos.x,
                y: wrap_pos.y,
            },
            sprite: view,
            time,
        }).then(() => {
            this.scale = scale;
            wrap.addChild(view);
            view.pos(wrap.width / 2, wrap.height / 2);
        });
    }
    /** 当前用户和其他用户tweenmove中不一样的地方抽离处理 */
    protected specialStyle(
        common_props: AnyObj,
        index: number,
        all: number,
    ): AnyObj {
        const rel_hal = index - (all - 1) / 2;
        let rotation = rel_hal * 10;
        if (all + 1 > 10) {
            rotation = (rel_hal * 80) / all;
        }
        const y =
            common_props.y + rel_hal * Math.tan(degreeToAngle(rotation)) * 5;
        return {
            ...common_props,
            rotation,
            y,
        };
    }
    /** sortCard的时候会调用, 牌从任何位置飞到牌堆 */
    public tweenMove(index: number, all: number) {
        const { view, card_light } = this.link;
        const { scale, copyed_face } = this;
        const space = view.width * scale * space_scale;
        let time = 200;
        const x = (view.width * scale) / 2 + space * index;
        const y = (view.height * scale) / 2;

        let end_props = { y, x } as AnyObj;

        if (this.slow_move) {
            if (!copyed_face) {
                view.x = x;
            } else {
                time = 700;
            }
            end_props = {
                ...end_props,
                scaleX: scale,
                scaleY: scale,
            };
            this.copyed_face = false;
            this.slow_move = false;
        }
        view.zOrder = index;
        end_props = this.specialStyle(end_props, index, all);

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
        if (this.is_destroyed) {
            return;
        }
        const { view } = this.link;
        view.destroy();

        super.destroy();
    }
}
