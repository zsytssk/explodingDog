import { TopBar } from '../hall/topbarCard';
import { log } from '../../mcTree/utils/zutil';
import { CMD } from '../../data/cmd';
type Link = {
    tab: Laya.Tab;
    main_stack: Laya.ViewStack;
    topbar: TopBar;
    btn_back: Laya.Sprite;
};

export class PopupShop extends ui.popup.popupShopUI {
    public name = 'shop';
    private link = {} as Link;
    private actions: SailIoAction;
    public CONFIG = {
        closeOnSide: true,
    };
    constructor() {
        super();
        this.init();
    }
    private init() {
        this.initLink();
        this.initEvent();
    }
    private initLink() {
        const topbar = new TopBar();
        topbar.top = 20;

        this.addChild(topbar);
        topbar.setTitle('shop');

        const { btnBack: btn_back } = topbar;

        const { tab, main_stack } = this;

        this.link = {
            ...this.link,
            btn_back,
            main_stack,
            tab,
            topbar,
        };
    }
    private initEvent() {
        this.actions = {
            [CMD.GET_MALL_LIST]: this.renderData,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GET_MALL_LIST);

        const { tab, main_stack, btn_back } = this.link;
        tab.selectHandler = new Laya.Handler(this, index => {
            for (let i = 0; i < tab.numChildren; i++) {
                const tab_item = tab.getChildAt(i);
                const overlay = tab_item.getChildAt(0) as Laya.Sprite;
                if (i === index) {
                    overlay.visible = false;
                } else {
                    overlay.visible = true;
                }
            }
            main_stack.selectedIndex = index;
            log(index);
        });
        tab.selectedIndex = 0;

        btn_back.on(Laya.Event.CLICK, this, () => {
            Sail.director.closeByName(this.name);
        });
    }
    private renderData(data) {}
}
