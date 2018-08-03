import { isNumber } from 'lodash';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { CurCardCtrl } from '../seat/cardBox/curCard';
import { CardCtrl } from './card';
import { CurSeatCtrl, cmd as seat_cmd } from '../seat/curSeat';
import { queryClosest, getChildrenByName } from '../../../mcTree/utils/zutil';
import { SeatStatus } from '../seat/seat';

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
        const { remain_num, heap, card } = view;
        const card_ctrl = new CardCtrl(card, heap);
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
    }
    public setRemainCard(num: number) {
        if (!isNumber(num)) {
            return;
        }
        const { remain_num } = this.link;
        remain_num.text = `剩余${num}张`;
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