import {
    slide_up_in,
    slide_down_out,
    setStyle,
} from '../../mcTree/utils/animate';
import { getCardInfo, getFilter } from '../../utils/tool';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { CARD_DISCRIBE_MAP } from '../../data/card';
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
    private is_toggled = false;
    private minus_h: number;
    constructor(card_id: string, wrap: Laya.Sprite) {
        super();
        this.card_id = card_id;
        this.link.wrap = wrap;
        nameMap(['intro'], null, this);
    }
    public init() {
        this.initLink();
        this.draw();
    }
    private initLink() {
        const { wrap } = this.link;

        const view = new ui.component.cardIntroUI();
        wrap.addChild(view);

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
        const { icon, content, title, bg, view } = this.link;
        const { card_id } = this;
        const card_info = getCardInfo(card_id);
        const icon_name = CARD_DISCRIBE_MAP[card_id].icon;
        icon.skin = `images/component/card/icon_${icon_name}.png`;
        title.skin = `images/component/card/title/${card_info.name}.png`;
        title.filters = [getFilter('black')];
        content.text = card_info.intro;
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
    public toggle() {
        const { is_toggled } = this;
        if (!is_toggled) {
            this.show();
        } else {
            this.hide();
        }
        this.is_toggled = !is_toggled;
    }
    private show() {
        const { view } = this.link;
        slide_up_in(view, 500);
    }
    private hide() {
        const { view } = this.link;
        slide_down_out(view).then(() => {
            // this.destroy();
        });
    }
    public destroy() {
        const { view } = this.link;
        view.destroy();
        super.destroy();
    }
}
