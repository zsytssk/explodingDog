import { isNumber } from 'lodash';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { getChildrenByName, queryClosest } from '../../../mcTree/utils/zutil';
import { CurCardCtrl } from '../seat/cardBox/curCard';
import { cmd as seat_cmd, CurSeatCtrl } from '../seat/curSeat';
import { SeatStatus } from '../seat/seat';
import { CardCtrl } from './card';
import { calcCreate } from './cardBackPool';

export interface Link {
    view: ui.game.cardHeapUI;
    heap: Laya.Box;
    remain_num: Laya.Text;
    card_ctrl: CardCtrl;
    cur_seat: CurSeatCtrl;
}

/** 牌堆控制器 */
export class CardHeapCtrl extends BaseCtrl {
    public name = 'card_heap';
    private card_num: number;
    protected link = {} as Link;
    constructor(view: ui.game.cardHeapUI) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    // tslint:disable-next-line:no-empty
    protected initLink() {
        const { view } = this.link;
        const { remain_num, heap, card, card_box } = view;
        const card_ctrl = new CardCtrl(card, card_box);
        this.addChild(card_ctrl);
        card_ctrl.init();

        const game_ctrl = queryClosest(this, 'name:game');
        const cur_seat = getChildrenByName(game_ctrl, 'seat')[0];

        this.link = {
            ...this.link,
            card_ctrl,
            cur_seat,
            heap,
            remain_num,
        };
    }
    private initEvent() {
        const { cur_seat } = this.link;
        this.bindOtherEvent(
            cur_seat,
            seat_cmd.status_change,
            (data: { status: SeatStatus }) => {
                const { status } = data;
                if (status === 'speak') {
                    this.activeTake();
                } else {
                    this.disableTake();
                }
            },
        );
        this.bindOtherEvent(
            cur_seat,
            seat_cmd.add_card,
            (data: { card: CurCardCtrl }) => {
                const { card } = data;
                this.setCardFace(card);
            },
        );
    }
    /** 激活拿牌 */
    public activeTake() {
        const { card_ctrl } = this.link;
        card_ctrl.setStatus('actived');
        /** 如果是当前用户出牌, 因为已经有card_ctrl显示 所以需要隐藏最上面的一张牌 */
        this.setHeapTopVisible();
    }
    /** 拿牌失败, 牌飞到牌堆 */
    public withDrawTake() {
        const { card_ctrl } = this.link;
        card_ctrl.withDrawCard();
    }
    /** 非当前用户 禁用拿牌 */
    public disableTake() {
        const { card_ctrl } = this.link;
        card_ctrl.setStatus('disabled');
        this.setHeapTopVisible();
    }
    public setRemainCard(num: number) {
        const { card_ctrl } = this.link;
        if (!isNumber(num)) {
            return;
        }
        const { remain_num } = this.link;
        remain_num.text = `剩余${num}张`;
        if (num) {
            card_ctrl.show();
        } else {
            card_ctrl.hide();
        }
        this.card_num = num;
        this.setHeapCard(num);
    }
    private setHeapCard(num: number) {
        const { heap } = this.link;
        if (num > 6) {
            num = 6;
        }
        const change_num = num - heap.numChildren;
        if (change_num === 0) {
            return;
        }
        calcCreate(heap, change_num);
        const len = heap.numChildren;
        for (let i = len - 1; i >= 0; i--) {
            const card_back = heap.getChildAt(i) as Laya.Sprite;
            card_back.x = 0;
            card_back.y = (len - 1 - i) * 5;
            card_back.visible = true;
        }
        this.setHeapTopVisible();
    }
    /** 在card_ctrl激活的时候需要将最上面一张牌隐藏, 以保持 */
    private setHeapTopVisible() {
        const { heap, card_ctrl } = this.link;
        const len = heap.numChildren;
        if (!len) {
            return;
        }
        let top_visible = false;
        if (card_ctrl.status === 'disabled') {
            top_visible = true;
        }
        for (let i = len - 1; i >= 0; i--) {
            const card_back = heap.getChildAt(i) as Laya.Sprite;
            if (i === len - 1) {
                card_back.visible = top_visible;
            } else {
                card_back.visible = true;
            }
        }
    }
    public reset() {
        const { card_ctrl } = this.link;
        this.setRemainCard(0);
        card_ctrl.reset();
    }
    /** 设置当前用户的牌的位置, 用来做牌飞到用户牌堆的动画 */
    public setCardFace(card: CurCardCtrl) {
        const { card_ctrl } = this.link;
        card_ctrl.putFaceToCard(card);
    }
}
