import { shuffle } from 'lodash';
import { CurCardCtrl } from './curCard';
import { CardBoxCtrl, Link as BaseLink } from './cardBox';
import { CardCtrl } from './card';
import { CurSeatCtrl } from '../curSeat';
import { log } from '../../../../mcTree/utils/zutil';
import { tween } from '../../../../mcTree/utils/animate';

export type CurCardBoxUI = ui.game.seat.cardBox.curCardBoxUI;
export interface Link extends BaseLink {
    view: CurCardBoxUI;
    seat: CurSeatCtrl;
    card_list: CurCardCtrl[];
}
type TouchStatus = 'move' | 'start' | 'default';
type TouchInfo = {
    status: TouchStatus;
    delta: Point;
    last_pos: Point;
};

export class CurCardBoxCtrl extends CardBoxCtrl {
    protected link: Link;
    private touch_info = {
        status: 'default',
    } as TouchInfo;
    protected card_creator = CurCardCtrl;
    constructor(view: CurCardBoxUI) {
        super(view);
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {
        super.initLink();
        const { view } = this.link;
        const { card_wrap } = view;
        const seat = this.parent as CurSeatCtrl;
        this.link = {
            ...this.link,
            card_wrap,
            seat,
        };
    }
    private initEvent() {
        const { view } = this.link;

        this.onNode(view, Laya.Event.MOUSE_DOWN, this.mouseDown);
        this.onNode(view, Laya.Event.MOUSE_MOVE, this.mouseMove);
        this.onNode(view, Laya.Event.MOUSE_UP, this.mouseEnd);
        this.onNode(view, Laya.Event.MOUSE_OVER, this.mouseEnd);
    }
    private mouseDown(event: Laya.Event) {
        const { touch_info } = this;
        this.touch_info = {
            ...touch_info,
            last_pos: {
                x: event.stageX,
                y: event.stageY,
            },
            status: 'start',
        };
    }
    private mouseMove(event: Laya.Event) {
        const { touch_info } = this;
        if (touch_info.status === 'default') {
            return;
        }
        const { x, y } = touch_info.last_pos;
        const { view } = this.link;
        const delta = {
            x: event.stageX - x,
            y: event.stageY - y,
        };
        if (!this.isMove()) {
            if (Math.abs(delta.x) < 30) {
                return;
            } else {
                delta.x = 0;
            }
        }
        const last_pos = {
            x: event.stageX,
            y: event.stageY,
        };
        this.touch_info = {
            ...touch_info,
            delta,
            last_pos,
            status: 'move',
        };
        view.x += delta.x;
        log('cardBox move', delta);
    }
    private mouseEnd(event: Laya.Event) {
        const { touch_info } = this;
        if (touch_info.status !== 'move') {
            return;
        }
        const { view, card_wrap } = this.link;
        const view_width = view.width;
        const card_wrap_width = card_wrap.width;

        const min_x = view_width - card_wrap_width;
        let x = view.x;
        if (x > 0) {
            x = 0;
        } else if (min_x >= 0) {
            /** 如果cardBox中没有填满牌 直接x=0就可以了 */
            x = 0;
        } else if (x < min_x) {
            x = min_x;
        }
        tween({
            end_props: {
                x,
            },
            sprite: view,
        });
        touch_info.status = 'default';
        log('cardBox end');
    }
    public isMove() {
        return this.touch_info.status === 'move';
    }
    /** 牌没有打出去， 回收牌 */
    public withDrawCardIndex(card, index: number) {
        let { card_list } = this.link;
        if (index > card_list.length - 1) {
            index = card_list.length - 1;
        }
        card_list = card_list.filter(item => {
            return item !== card;
        });

        card_list.splice(index, 0, card);
        this.link.card_list = card_list;

        return index;
    }

    public unToggleExcept(card: CardCtrl) {
        const { card_list } = this.link;
        for (const card_item of card_list) {
            if (card_item === card) {
                continue;
            }
            if (card_item.show_tip) {
                card_item.toggleTip();
            }
        }
    }
    public shuffle() {
        const { card_list } = this.link;
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.link.card_list = shuffle(card_list);
                this.sortCard();
            }, 500 * i);
        }
    }
    /** 将本身放到另外的上面去， 炸弹弹出层里面 */
    public putCardBoxInWrap(wrap: Laya.Sprite, card_move_box: Laya.Sprite) {
        const { view } = this.link;
        const ori_pos = new Laya.Point(0, 0);
        view.localToGlobal(ori_pos);
        wrap.globalToLocal(ori_pos);

        view.pos(ori_pos.x, ori_pos.y);
        wrap.addChild(view);
        this.link.card_move_box = card_move_box;
        return this;
    }
}
