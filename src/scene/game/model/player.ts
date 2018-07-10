import { fill } from 'lodash';
import { BaseEvent } from '../../../mcTree/event';
import { CardModel } from './card';

export const cmd = {
    add_card: 'add_card',
};
export class PlayerModel extends BaseEvent {
    public is_cur_player: boolean;
    public seat_id: number;
    public user_id: string;
    public nickname: string;
    public avatar: string;
    public card_list: CardModel[] = [];
    constructor(player_data: UserData, is_cur_player: boolean) {
        super();
        this.is_cur_player = is_cur_player;
        this.updateInfo(player_data);
    }
    public updateInfo(player_data: UserData) {
        this.user_id = player_data.userId;
        this.nickname = player_data.nickname;
        this.avatar = player_data.avatar;
        this.seat_id = Number(player_data.seatId);

        let shou = player_data.shou;
        if (!this.is_cur_player) {
            shou = fill(Array(player_data.shouLen), '*');
        } else {
            this.updateCards(fill());
        }
        this.updateCards(shou);
    }
    public updateCards(cards_info: CardData[]) {
        if (!cards_info) {
            return;
        }
        for (const card_info of cards_info) {
            this.addCard(card_info);
        }
    }
    /**  */
    private addCard(data: CardData) {
        const card = new CardModel(data);
        this.card_list.push(card);
        this.trigger(cmd.add_card, { card });
    }
    /** 从牌堆找出牌在调用discard， 返回cardModel给game用来展示在去拍区域 */
    public discardCard(data: HitData) {
        const card_list = this.card_list;
        const { cardId } = data.hitCardInfo;
        for (let i = 0; i < card_list.length; i++) {
            const card = card_list[i];
            if (card.is_prepare_discarded && card.card_id === cardId + '') {
                card_list.splice(i, 1);
                card.discard();
                return card;
            }
        }
    }
    public leave() {
        this.destroy();
    }
}
