import { BaseEvent } from '../../../mcTree/event';

export const cmd = {
    discard: 'discard',
};
export class CardModel extends BaseEvent {
    /** 牌的id */
    public card_id: string;
    /** 牌的操作次数 */
    public card_count: number;
    /** 是否被出牌 */
    public is_prepare_discarded = false;
    constructor(card_id: string) {
        super();
        this.card_id = card_id;
    }
    /** 真正的出牌前 需要记录状态 */
    public preDiscard() {
        this.is_prepare_discarded = true;
    }
    /** 真正的出牌前 需要记录状态 */
    public discard() {
        this.trigger(cmd.discard);
    }
}
