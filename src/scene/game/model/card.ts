import { BaseEvent } from '../../../mcTree/event';

export class CardModel extends BaseEvent {
    /** 牌的id */
    private card_id: string;
    /** 牌的操作次数 */
    public card_count: number;
    constructor(card_id: string) {
        super();
        this.card_id = card_id;
    }
}
