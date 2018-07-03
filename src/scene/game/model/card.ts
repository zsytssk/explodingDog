import { BaseEvent } from '../../../mcTmpl/event';

export class CardModel extends BaseEvent {
    private card_id: string;
    public card_count: number;
}
