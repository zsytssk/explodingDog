import { BaseEvent } from '../../../mcTree/event';
import { CardModel } from './card';

export class PlayerModel extends BaseEvent {
    public seat_id: number;
    public user_id: string;
    public nickname: string;
    public avatar: string;
    private card_list: PlayerModel[] = [];
    constructor(player_data: UserData) {
        super();
        this.user_id = player_data.userId;
        this.nickname = player_data.nickname;
        this.avatar = player_data.avatar;
        this.seat_id = Number(player_data.seatId);
    }
    public updateCard() {}
    /** 增加用户的牌 */
    private addCard() {}
    private removeCard() {}
}
