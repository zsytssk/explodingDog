import { BaseCtrl } from '../../../../mcTree/ctrl/base';
import { setStyle } from '../../../../mcTree/utils/animate';
import {
    getCardInfo,
    stopSkeleton,
    playSkeleton,
} from '../../../../utils/tool';

export type FaceProps = {
    scale: number;
    pos: Laya.Point;
    show_light_ani: boolean;
};
type CardView = ui.game.seat.cardBox.cardUI;
export interface Link {
    view: CardView;
    wrap: Laya.Sprite;
    /** 牌堆牌光圈动画 */
    light_ani: Laya.Skeleton;
    /** annoy 泥土动画 */
    mud_ani: Laya.Skeleton;
    /** 拿到牌星星动画 */
    star_ani: Laya.Skeleton;
}

export const space_scale = 1 / 2;
/** 基本所有牌的基类, 只管牌的渲染 */
export class CardBaseCtrl extends BaseCtrl {
    public name = 'card';
    protected link = {} as Link;
    /** 牌需要缩小的比例， 所有的牌都使用一个ui， 需要根据父类的 高度|宽度 去做缩小 */
    protected scale: number;
    public card_id: string;
    /** 是否从其他牌复制属性, 比方说拿牌 偷牌时, 牌复制目标牌样式, 然后 tweenMove 飞到自己的位置 */
    protected copyed_face: boolean;
    constructor(card_id: string, wrap: Laya.Sprite) {
        super();
        this.setCardId(card_id);
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
    }
    protected setCardId(card_id: string) {
        this.card_id = card_id;
    }
    protected initLink() {
        this.initUI();
        const { view } = this.link;
        const { light_ani, star_ani, mud_ani } = view;

        stopSkeleton(light_ani);
        stopSkeleton(star_ani);
        stopSkeleton(mud_ani);
        this.link = {
            ...this.link,
            light_ani,
            mud_ani,
            star_ani,
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
    /** 画牌面+id */
    public drawCard() {
        const { card_id } = this;
        const { view } = this.link;
        const { url } = getCardInfo(card_id);
        const { card_id: view_card_id, card_face, card_back } = view;
        if (url) {
            card_face.skin = url;
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
    public setStyle(props: AnyObj) {
        const { view } = this.link;
        setStyle(view, {
            ...props,
        });
    }
    public resetStyle() {
        const { view } = this.link;
        view.zOrder = 0;
    }
    /** 播放星星动画 */
    public playStarAni(name: string) {
        const { star_ani } = this.link;

        star_ani.visible = true;
        star_ani.once(Laya.Event.COMPLETE, star_ani, () => {
            star_ani.visible = false;
        });
        playSkeleton(star_ani, name || 0, false);
    }
    /** 播放星星动画 */
    public playMudAni() {
        const { mud_ani } = this.link;

        mud_ani.visible = true;
        mud_ani.once(Laya.Event.COMPLETE, mud_ani, () => {
            mud_ani.visible = false;
        });
        playSkeleton(mud_ani, 0, false);
    }
    /** 通过CardHeap中牌的位置大小 设置牌的属性 计算放的位置 再放到牌堆 */
    public setFace(props: FaceProps) {
        const { wrap, light_ani } = this.link;
        const { scale, pos } = props;
        wrap.globalToLocal(pos);
        if (props.show_light_ani) {
            light_ani.visible = true;
            playSkeleton(light_ani, 0, true);
        }
        this.copyed_face = true;
        this.setStyle({
            scaleX: scale,
            scaleY: scale,
            x: pos.x,
            y: pos.y,
        });
        // this.withDrawCard();
    }
    public getCardFace(): FaceProps {
        const { scale } = this;
        const { view, light_ani } = this.link;
        const pos = new Laya.Point(
            (view.width * scale) / 2,
            (view.height * scale) / 2,
        );
        view.localToGlobal(pos);
        const show_light_ani = light_ani.visible;
        return {
            pos,
            scale,
            show_light_ani,
        };
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
