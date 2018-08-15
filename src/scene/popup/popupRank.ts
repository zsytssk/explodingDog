import { TopBar } from '../hall/topbarCard';
import {
    getCardInfo,
    getAvatar,
    isCurPlayer,
    popupFadeInEffect,
    popupFadeOutEffect,
} from '../../utils/tool';
import { CMD } from '../../data/cmd';
import { log, logAll, ellipsisStr } from '../../mcTree/utils/zutil';
import { BgCtrl } from '../component/bgCtrl';
import { rankIcon } from '../hall/rankIcon';

type DataItem = {
    avatar: string;
    nickname: string;
    score: number;
    rate: number;
    rank: number;
    user_id: string;
    danGrading: number;
};
type Link = {
    top_bar: TopBar;
    my_rank: CurItemUI;
    list: Laya.List;
};

type ItemUI = ui.popup.rank.itemUI;
type CurItemUI = ui.popup.rank.curItemUI;

export class PopupRank extends ui.popup.rank.popUI {
    public name = 'rank';
    private actions: SailIoAction;
    protected link = {} as Link;
    constructor() {
        super();
        this.init();
        this.popupEffect = popupFadeInEffect(this);
        this.closeEffect = popupFadeOutEffect(this);
    }
    private init() {
        this.initLink();
        this.initEvent();
    }
    private initLink() {
        const { list, my_rank } = this;
        const top_bar = new TopBar();
        top_bar.top = 20;

        this.addChild(top_bar);
        top_bar.setTitle('rank');

        const { bg } = this;
        const bg_ctrl = new BgCtrl(bg);
        bg_ctrl.init();

        this.link = {
            ...this.link,
            list,
            my_rank,
            top_bar,
        };
    }
    private initEvent() {
        const { list, top_bar } = this.link;
        const { btnBack } = top_bar;
        this.actions = {
            [CMD.GET_RANK_LIST]: this.renderData,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GET_RANK_LIST);

        list.dataSource = [];
        list.vScrollBarSkin = '';
        list.renderHandler = new Laya.Handler(this, (box: Laya.Box, index) => {
            box.removeChildren();
            const data_item = list.dataSource[index] as DataItem;
            let item_ui;
            item_ui = new ui.popup.rank.itemUI();
            box.addChild(item_ui);
            this.renderItem(item_ui, data_item);
        });

        btnBack.on(Laya.Event.CLICK, this, () => {
            Sail.director.closeByName(this.name);
        });
    }
    private renderData(server_data: GetRankListData) {
        const { list, my_rank } = this.link;
        const { list: data_list, myRankInfo } = server_data;
        const data = [] as DataItem[];
        for (const data_item of data_list) {
            const {
                avatar,
                score,
                winRate: rate,
                rank,
                nickname,
                userId: user_id,
                danGrading
            } = data_item;
            data.push({
                avatar: getAvatar(data_item.avatar),
                nickname: ellipsisStr(nickname, 18, '..'),
                rank,
                rate,
                score,
                user_id,
                danGrading
            });
        }
        list.dataSource = data;
        this.renderItem(my_rank, {
            avatar: getAvatar(myRankInfo.avatar),
            nickname: ellipsisStr(myRankInfo.nickname, 14, '..'),
            rank: myRankInfo.rank,
            rate: myRankInfo.winRate,
            score: myRankInfo.score,
            user_id: myRankInfo.userId,
            danGrading: myRankInfo.danGrading
        });
    }
    private renderItem(ui: ItemUI | CurItemUI, data: DataItem) {
        const { avatar, nickname, rank, rank_clip, rate, score, gradeBox } = ui;
        const { rate: rate_num, danGrading } = data;
        let rate_text = '';
        if (rate_num === -1) {
            rate_text = '--';
        } else {
            rate_text = rate_num.toFixed(2) + '%';
        }
        rate.text = rate_text;
        nickname.text = data.nickname + '';
        rank.text = data.rank + '';
        score.text = data.score + '';
        avatar.skin = data.avatar;
        rank_clip.index = data.rank - 1;
        let grade = new rankIcon(danGrading);
        grade.scale(0.8, 0.8);
        gradeBox.addChild(grade);
    }
}
