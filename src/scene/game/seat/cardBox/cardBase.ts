import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { setStyle } from '../../../../mcTree/utils/animate';
import { getCardInfo, stopSkeleton } from '../../../../utils/tool';
import { CardBoxCtrl } from './cardBox';

type CardView = ui.game.seat.cardBox.cardUI;
export interface Link {
    view: CardView;
    wrap: Laya.Sprite;
    card_light: Laya.Skeleton;
}

export const space_scale = 1 / 2;
/** 基本所有牌的基类, 只管牌的渲染 */
export class CardBaseCtrl extends BaseCtrl {
    public name = 'card';
    protected link = {} as Link;
    /** 牌需要缩小的比例， 所有的牌都使用一个ui， 需要根据父类的高度去做缩小 */
    protected scale: number;
    protected card_id: string;
    constructor(card_id: string, wrap: Laya.Sprite) {
        super();
        this.card_id = card_id;
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
    }
    protected initLink() {
        this.initUI();
        const { view } = this.link;
        const { card_light } = view;

        stopSkeleton(card_light);
        this.link = {
            ...this.link,
            card_light,
        };
        this.drawCard();
    }
    /** 初始化ui， 设置当前其他玩家牌的样式（大小 显示牌背面） */
    protected initUI() {
        const { wrap } = this.link;
        const view = new ui.game.seat.cardBox.cardUI();
        const scale = wrap.height / view.height;

        wrap.addChild(view);
        setStyle(view, {
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: scale,
            scaleY: scale,
        });
        this.link = {
            view,
            ...this.link,
        };
        this.scale = scale;
    }
    public setStyle(props: AnyObj) {
        const { view } = this.link;
        setStyle(view, {
            ...props,
        });
    }
    /** 设置牌的样式 */
    public drawCard() {
        const { card_id } = this;
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
    public resetStyle() {
        const { view } = this.link;
        view.zOrder = 0;
    }
    public destroy() {
        const { view } = this.link;
        view.destroy();
        super.destroy();
    }
}
