import {
    slide_up_in,
    slide_down_out,
    setStyle,
} from '../../mcTree/utils/animate';
import { getCardInfo, getFilter } from '../../utils/tool';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { nameMap } from '../../mcTree/utils/zutil';

type UI = ui.component.cardIntroUI;
interface Link {
    view: UI;
    icon: Laya.Image;
    title: Laya.Image;
    content: Laya.Text;
    bg: Laya.Image;
    wrap: Laya.Sprite;
}
const max_content_h = 114;

/** 牌说明 */
export class CardIntroCtrl extends BaseCtrl {
    protected link = {} as Link;
    private card_id: string;
    private minus_h: number;
    constructor(card_id: string, wrap: Laya.Sprite) {
        super();
        this.card_id = card_id;
        this.link.wrap = wrap;
    }
    public init() {
        this.initLink();
        this.draw();
    }
    private initLink() {
        const { wrap } = this.link;

        const view = new ui.component.cardIntroUI();
        wrap.addChild(view);
        view.visible = false;

        const { icon, content, title, bg } = view;
        this.link = {
            ...this.link,
            bg,
            content,
            icon,
            title,
            view,
        };
    }
    private draw() {
        const { icon: icon_node, content, title, bg, view } = this.link;
        const { card_id } = this;
        const { color, icon, name, intro } = getCardInfo(card_id);
        icon_node.skin = `images/component/card/icon/${icon}.png`;
        bg.skin = `images/component/card/intro_bd/bd_intro_${color}.png`;
        title.skin = `images/component/card/title/${name}.png`;
        title.filters = [getFilter('black')];
        content.text = intro;
        const minus_h = max_content_h - content.height - 10;

        view.height -= minus_h;
        bg.height -= minus_h;
        this.minus_h = minus_h;
    }

    public setStyle(props: AnyObj) {
        const { view } = this.link;
        const { minus_h } = this;
        if (props.y) {
            props.y += minus_h;
        }
        setStyle(view, {
            ...props,
        });
    }
    public show() {
        const { view } = this.link;
        slide_up_in(view, 200);
    }
    public hide() {
        const { view } = this.link;
        slide_down_out(view, 200);
    }
    public destroy() {
        const { view } = this.link;
        view.destroy();
        super.destroy();
    }
}
