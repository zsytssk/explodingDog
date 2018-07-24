import { cmd as base_cmd } from '../../../../mcTree/event';
import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel, cmd as card_cmd } from '../../model/card/card';
import { ActionSendData } from '../../model/card/action';
import { getCardInfo, convertPos } from '../../../../utils/tool';
import { tween, setStyle } from '../../../../mcTree/utils/animate';
import { CMD } from '../../../../data/cmd';
import { CardBoxCtrl } from './cardBox';
import { queryClosest } from '../../../../mcTree/utils/zutil';
import { GameCtrl } from '../../main';

type CardView = ui.game.seat.cardBox.cardUI;
export interface Link {
    card_box: CardBoxCtrl;
    view: CardView;
    wrap: Laya.Sprite;
}

const card_height = 238;
const space_scale = 1 / 2;
export class CardCtrl extends BaseCtrl {
    public name = 'card';
    protected link = {} as Link;
    protected model: CardModel;
    /** 是否被选中 */
    public is_selected = false;
    /** 牌需要缩小的比例， 所有的牌都使用一个ui， 需要根据父类的高度去做缩小 */
    private scale: number;
    constructor(model: CardModel, wrap: Laya.Sprite) {
        super();
        this.model = model;
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        this.initUI();
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
    /** 初始化ui， 设置当前其他玩家牌的样式（大小 显示牌背面） */
    private initUI() {
        const { wrap } = this.link;
        const view = new ui.game.seat.cardBox.cardUI();
        const scale = wrap.height / view.height;

        wrap.addChild(view);
        setStyle(view, { scaleX: scale, scaleY: scale });
        this.link = {
            card_box: this.parent,
            view,
            ...this.link,
        };
        this.scale = scale;
        this.setStyle();
    }
    protected initEvent() {
        this.onModel(card_cmd.discard, () => {
            this.discard();
        });
        this.onModel(card_cmd.give, () => {
            this.give();
        });
        this.onModel(base_cmd.destroy, () => {
            this.destroy();
        });
        this.onModel(card_cmd.action_send, (data: ActionSendData) => {
            Sail.io.emit(CMD.HIT, {
                hitCard: this.model.card_id,
                hitParams: data,
            } as HitBackData);
        });
        this.onModel(card_cmd.update_info, () => {
            this.setStyle();
        });
    }
    /** 设置牌的样式 */
    public setStyle() {
        const { card_id } = this.model;
        const { view } = this.link;
        const card_info = getCardInfo(card_id);
        const {
            card_id: view_card_id,
            card_count,
            card_face,
            card_back,
        } = view;
        if (card_info) {
            card_face.skin = card_info.url;
            if (card_info.show_count) {
                card_count.visible = true;
                card_count.text = card_info.count;
            }
            view_card_id.text = `id:${card_id}`;
            card_back.visible = false;
        } else {
            card_back.visible = true;
        }
    }
    protected discard() {
        const { card_box } = this.link;
        card_box.discardCard(this);
    }
    /** 其他用户的牌在被给出时直接销毁 */
    protected give() {
        const { card_box } = this.link;
        card_box.giveCard(this);
        this.destroy();
    }
    /** 将牌放到game中的animate_box中飞行到特定的位置， 在放到牌堆中 */
    public putCardInWrap(wrap: Laya.Sprite) {
        const { view, card_box } = this.link;
        const card_move_box = card_box.getCardMoveBox();

        const scale = wrap.height / card_height;
        const card_pos = new Laya.Point(0, 0);
        const wrap_pos = new Laya.Point(0, 0);
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
            view.pos(0, 0);
        });
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { view } = this.link;
        const { scale } = this;
        const space = view.width * scale * space_scale;
        const y = 0;
        const x = space * index;
        const end_props = { y, x };
        tween({
            end_props,
            sprite: view,
            time: 100,
        });
    }
    public destroy() {
        const { view } = this.link;
        view.destroy();

        super.destroy();
    }
}
