import { fill } from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { BaseEvent } from '../../../mcTree/event';
import { CardModel } from './card/card';
import { BeActionInfo } from './card/action';

export type PlayerStatus = 'speak' | 'wait_give' | 'normal';
export const cmd = {
    /** 动作信息 */
    action: 'action',
    add_card: 'add_card',
    status_change: 'status_change',
    wait_choose: 'wait_choose',
};
/** 动作的信息 */
export type ObserverActionInfo = PartialAll<
    BeActionInfo,
    {
        /** 动作执行的resolve */
        observer?: Subscriber<string | string[]>;
    }
>;

export class PlayerModel extends BaseEvent {
    public is_cur_player: boolean;
    public seat_id: number;
    public user_id: string;
    public nickname: string;
    public avatar: string;
    /** 正在出牌 */
    public status: PlayerStatus;
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
        const shouLen = player_data.shouLen;
        if (!this.is_cur_player && shouLen) {
            shou = fill(Array(player_data.shouLen), '*');
        }
        this.updateCards(shou);
    }
    public updateCards(cards_info: CardData[]) {
        if (!cards_info) {
            return;
        }
        for (const card_info of cards_info) {
            this.addCard(card_info + '');
        }
    }
    public addCard(card: string | CardModel) {
        if (!card) {
            return;
        }
        if (!(card instanceof CardModel)) {
            card = new CardModel(card);
        }
        card.setOwner(this);
        this.card_list.push(card);
        this.trigger(cmd.add_card, { card });
    }
    public removeCard(card: CardModel) {
        const card_list = this.card_list;
        for (let i = 0; i < card_list.length; i++) {
            if (card_list[i] === card) {
                card_list.splice(i, 1);
            }
        }
    }
    /** 从牌堆找出牌在调用discard， 返回cardModel给game用来展示在去拍区域 */
    public discardCard(card_id: string) {
        const card_list = this.card_list;
        let discard_card: CardModel;

        for (let i = 0; i < card_list.length; i++) {
            const card = card_list[i];
            if (card.canDiscard(card_id)) {
                discard_card = card;
                card_list.splice(i, 1);
                discard_card.discard();
                return discard_card;
            }
        }
    }
    public giveCard(card_id: string) {
        const card_list = this.card_list;
        let give_card: CardModel;

        for (let i = 0; i < card_list.length; i++) {
            const card = card_list[i];
            if (card.canGive(card_id)) {
                give_card = card;
                card_list.splice(i, 1);
                return give_card;
            }
        }
    }
    /** 取消出牌 */
    public unDiscardCard() {
        const card_list = this.card_list;
        /** 非当前用户 不需要处理 */
        if (!this.is_cur_player) {
            return;
        }
        /** 当前用户还原出的状态 */
        for (const card of card_list) {
            card.unDiscard();
        }
    }
    public setStatus(status: PlayerStatus) {
        if (status === this.status) {
            return;
        }
        this.status = status;
        this.trigger(cmd.status_change, { status });
    }
    public beActioned(data: BeActionInfo): Observable<string | string[]> {
        return new Observable(observer => {
            const { status, action } = data;
            if (action === 'wait_get_card') {
                if (status === 'act') {
                    this.setStatus('wait_give');
                } else {
                    this.setStatus('normal');
                }
            }
            this.trigger(cmd.action, {
                observer,
                ...data,
            } as ObserverActionInfo);
        });
    }
    public isMyId(user_id: string) {
        return this.user_id === user_id + '';
    }
    public leave() {
        this.destroy();
    }
}
