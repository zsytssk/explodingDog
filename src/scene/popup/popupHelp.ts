import { TopBar } from '../hall/topbarCard';
import { CARD_MAP } from '../../data/card';
import {
    getCardInfo,
    popupFadeOutEffect,
    popupFadeInEffect,
    splitStr,
    getBlongStr,
} from '../../utils/tool';
import { BgCtrl } from '../bgCtrl';

type DataItem = {
    card: {
        skin: string;
    };
    intro: string;
    name: string;
    belong: number[];
    overlay: {
        visible: boolean;
    };
};
export class PopupHelp extends ui.popup.popupHelpUI {
    public name = 'help';
    private top_bar: TopBar;
    constructor() {
        super();
        this.init();
        this.popupEffect = popupFadeInEffect(this);
        this.closeEffect = popupFadeOutEffect(this);
    }
    private init() {
        const { bg } = this;
        const bg_ctrl = new BgCtrl(bg);
        bg_ctrl.init();

        const top_bar = new TopBar();
        top_bar.top = 20;

        this.addChild(top_bar);
        top_bar.setTitle('help');
        this.top_bar = top_bar;

        this.initData();
        this.initEvent();
    }
    private initData() {
        const { list } = this;

        const data = [] as DataItem[];
        for (const key in CARD_MAP) {
            if (!CARD_MAP.hasOwnProperty(key)) {
                continue;
            }
            const card_info = getCardInfo(key);
            data.push({
                belong: card_info.belong,
                card: {
                    skin: card_info.url,
                },
                intro: card_info.intro,
                name: card_info.name,
                overlay: {
                    visible: true,
                },
            });
        }
        list.dataSource = data;
    }

    private initEvent() {
        const { list, top_bar } = this;
        const { btnBack } = top_bar;
        list.selectEnable = true;
        list.selectHandler = new Laya.Handler(this, index => {
            const data = list.dataSource;
            for (let i = 0; i < data.length; i++) {
                if (i === index) {
                    this.renderSider(data[i]);
                    data[i].overlay.visible = false;
                } else {
                    data[i].overlay.visible = true;
                }
            }
            list.refresh();
        });
        list.selectedIndex = 0;

        btnBack.on(Laya.Event.CLICK, this, () => {
            Sail.director.closeByName(this.name);
        });
    }
    private renderSider(data: DataItem) {
        const { sider_intro, sider_card, sider_title, belong } = this;
        sider_card.skin = data.card.skin;
        sider_title.skin = `images/pop/help/cardTitle/${data.name}.png`;
        sider_intro.text = splitStr(data.intro, 26);
        belong.text = getBlongStr(data.belong);
    }
}
