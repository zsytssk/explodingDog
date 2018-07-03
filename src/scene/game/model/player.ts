import { BaseEvent } from '../../../mcTmpl/event';
import { CardModel } from './card';

export class PlayerModel extends BaseEvent {
    public user_id: string;
    private card_list: PlayerModel[] = [];
    constructor(player_data: UserData) {
        super();
        this.user_id = player_data.userId;
    }
}
