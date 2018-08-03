import { GiveCardCtrl } from '../widget/giveCard';
import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { queryClosest, getChildrenByName } from '../../../mcTree/utils/zutil';
import { CardHeapCtrl } from '../cardHeap/main';
import { CurCardCtrl } from './cardBox/curCard';

type Link = {
    give_card_ctrl: GiveCardCtrl;
    card_heap_ctrl: CardHeapCtrl;
};
export class OutFaceCom {
    private link = {} as Link;
    private belong_ctrl: BaseCtrl;
    constructor(belong_ctrl: BaseCtrl) {
        this.belong_ctrl = belong_ctrl;
    }
    private init() {
        const { belong_ctrl } = this;
        const game_ctrl = queryClosest(belong_ctrl, 'name:game');
        const give_card_ctrl = getChildrenByName(game_ctrl, 'card_heap')[0];
        const card_heap_ctrl = getChildrenByName(game_ctrl, 'give_card')[0];

        this.link = {
            card_heap_ctrl,
            give_card_ctrl,
        };
    }
    public activeTake() {
        const { card_heap_ctrl } = this.link;
        card_heap_ctrl.activeTake();
    }
    public disabledTake() {
        const { card_heap_ctrl } = this.link;
        card_heap_ctrl.disableTake();
    }
    public setCardFace(card: CurCardCtrl) {
        const { card_heap_ctrl } = this.link;
        card_heap_ctrl.setCardFace(card);
    }
}
