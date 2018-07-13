import { PlayerModel } from '../player';
import { CardModel } from './card';

export class CardStealModel extends CardModel {
    constructor(card_id: string, player?: PlayerModel) {
        super(card_id, player);
    }
}
