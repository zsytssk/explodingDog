import { TopBar } from '../hall/topbarCard';
import { CARD_MAP } from '../../data/card';
import { getCardInfo } from '../../utils/tool';

type DataItem = {
    card: {
        skin: string;
    };
    intro: string;
    overlay: {
        visible: boolean;
    };
};
export class PopupHelp extends ui.popup.popupHelpUI {
    public name = 'help';
    constructor() {
        super();
        this.init();
    }
    private init() {
        const topbar = new TopBar();
        topbar.top = 20;

        this.addChild(topbar);
        topbar.setTitle('help');
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
                card: {
                    skin: card_info.url,
                },
                intro: 'sdfsdfsdfsdfsdf',
                overlay: {
                    visible: true,
                },
            });
        }
        list.dataSource = data;
    }

    private initEvent() {
        const { list } = this;
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
    }
    private renderSider(data: DataItem) {
        const { sider_intro, sider_card } = this;
        sider_card.skin = data.card.skin;
        sider_intro.text = data.intro;
    }
}
