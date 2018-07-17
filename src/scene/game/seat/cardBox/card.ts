import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { CardModel, cmd as card_cmd, ActionData } from '../../model/card/card';
import { getCardInfo } from '../../../../utils/tool';
import { tween, setStyle } from '../../../../mcTree/utils/animate';
import { CMD } from '../../../../data/cmd';
import { CardBoxCtrl } from './cardBox';

type CardView = ui.game.seat.cardBox.cardUI;
export interface Link {
    card_box: CardBoxCtrl;
    view: CardView;
    wrap: Laya.Sprite;
}

const card_height = 238;
export class CardCtrl extends BaseCtrl {
    public name = 'card';
    protected link = {} as Link;
    protected model: CardModel;
    /** 是否被选中 */
    public is_selected = false;
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
    /** 初始化ui， 设置当前其他玩家牌的样式（大小 显示牌背面） */
    public initUI() {
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
        this.setStyle();
    }
    protected initEvent() {
        this.onModel(card_cmd.discard, () => {
            this.discard();
        });
        this.onModel(card_cmd.action_send, (data: ActionData) => {
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
    public putCardInWrap(wrap: Laya.Sprite) {
        const { view } = this.link;
        const scale = wrap.height / card_height;
        const card_pos = new Laya.Point(0, 0);
        const wrap_pos = new Laya.Point(0, 0);
        view.localToGlobal(card_pos);
        wrap.localToGlobal(wrap_pos);

        Laya.stage.addChild(view);
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
            wrap.addChild(view);
            view.pos(0, 0);
        });
    }
    /** 移动位置 */
    public tweenMove(index: number) {
        const { wrap, view } = this.link;
        const space = (view.width * wrap.height) / (view.height * 2);
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
