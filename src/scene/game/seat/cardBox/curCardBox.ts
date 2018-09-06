import { shuffle } from 'lodash';
import { setStyle, tween } from '../../../../mcTree/utils/animate';
import { log } from '../../../../mcTree/utils/zutil';
import { createSkeleton, playSkeleton } from '../../../../utils/tool';
import { CurSeatCtrl } from '../curSeat';
import { CardCtrl } from './card';
import { CardBoxCtrl, Link as BaseLink } from './cardBox';
import { CurCardCtrl } from './curCard';

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

const blind_ani_pos = {
    x: 535,
    y: 350,
};
export class CurCardBoxCtrl extends CardBoxCtrl {
    protected link: Link;
    public has_card_drag = false;
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
        this.onNode(Laya.stage, Laya.Event.MOUSE_MOVE, this.mouseMove);
        this.onNode(Laya.stage, Laya.Event.MOUSE_UP, this.mouseEnd);
        this.onNode(Laya.stage, Laya.Event.MOUSE_OVER, this.mouseEnd);
    }
    private mouseMove(event: Laya.Event) {
        const { touch_info } = this;
        /** 如果有牌拖动时候时候不能拖动cardBox */
        if (this.has_card_drag) {
            this.mouseEnd();
            return;
        }
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
            if (Math.abs(delta.x) < 150) {
                return;
            }
            delta.x = 0;
            this.unToggleExcept();
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
    private mouseEnd() {
        const { touch_info } = this;
        this.offNode(Laya.stage);
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

        card_list = card_list.filter(item => {
            return item !== card;
        });

        if (index > card_list.length) {
            index = card_list.length;
        } else if (index < 0) {
            index = 0;
        }

        card_list.splice(index, 0, card);
        this.link.card_list = card_list;

        return index;
    }

    public unToggleExcept(card?: CardCtrl) {
        const { card_list } = this.link;
        for (const card_item of card_list) {
            if (card) {
                if (card_item === card) {
                    continue;
                }
            }
            if (card_item.show_tip) {
                card_item.toggleTip();
            }
        }
    }
    public movePosCenter(x: number) {
        // putInBoxByPos
        const { view } = this.link;
        const new_x = view.width / 2 - x;

        return tween({
            end_props: {
                x: new_x,
            },
            sprite: view,
        });
    }
    /** 致盲时洗牌 */
    public shuffle() {
        const { card_list, view, card_wrap } = this.link;
        /** 致盲烟雾动画 */
        const blind_ani = createSkeleton('blind');
        view.addChild(blind_ani);

        blind_ani_pos.x = Math.min(view.width, card_wrap.width) / 2;
        setStyle(blind_ani, blind_ani_pos);

        const num = 5;
        let played_num = 0;
        blind_ani.player.on(Laya.Event.COMPLETE, blind_ani, () => {
            played_num++;
            if (played_num >= num) {
                blind_ani.destroy();
            }
        });
        playSkeleton(blind_ani, 0, true);

        for (let i = 0; i < num; i++) {
            setTimeout(() => {
                this.link.card_list = shuffle(card_list);
                this.sortCard();
            }, 500 * i);
        }
    }
    /** 将本身放到另外的上面去， 炸弹弹出层里面 */
    public putCardBoxInWrap(wrap: Laya.Sprite, card_move_box: Laya.Sprite) {
        const { view } = this.link;
        view.pos(0, 0);
        this.link.card_list.forEach(card => {
            card.unDraw();
        })
        setTimeout(() => {
            wrap.addChild(view);
            this.link.card_move_box = card_move_box;
            return this;
        }, 100);
    }

    public sortCard() {
        super.sortCard();
        this.unToggleExcept();
    }
}
