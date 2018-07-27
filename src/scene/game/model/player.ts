import { fill } from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { BaseEvent } from '../../../mcTree/event';
import { CardModel, CardStatus } from './card/card';
import { BeActionInfo } from './card/action';
import { isCurPlayer } from '../../../utils/tool';
import { logErr } from '../../../mcTree/utils/zutil';

export type PlayerStatus = 'speak' | 'die' | 'normal';
export const cmd = {
    /** 动作信息 */
    action: 'action',
    add_card: 'add_card',
    blind_status: 'blind_status',
    remove_cards: 'remove_cards',
    status_change: 'status_change',
    wait_choose: 'wait_choose',
};
export type BlindStatus = {
    is_blind: boolean;
};
/** 动作的信息 */
export type ObserverActionInfo = PartialAll<
    BeActionInfo,
    {
        /** 动作执行的resolve */
        observer?: Subscriber<string | string[]>;
    }
>;

/** 拿牌的信息 */
export type AddInfo = {
    card: CardModel;
    is_take: boolean;
};

export class PlayerModel extends BaseEvent {
    public is_cur_player: boolean;
    public seat_id: number;
    public user_id: string;
    public nickname: string;
    public avatar: string;
    /** 正在出牌 */
    public status: PlayerStatus;
    public is_wait_give = false;
    public card_list: CardModel[] = [];
    constructor(player_data: UserData) {
        super();
        this.updateInfo(player_data);
    }
    public updateInfo(player_data: UserData) {
        const {
            userId,
            nickname,
            avatar,
            seatId,
            userStatus,
            shouLen,
            annoyCards,
            annoyCardsIdx,
            hasBlindEffect,
        } = player_data;
        let { shou } = player_data;

        this.user_id = userId;
        this.is_cur_player = isCurPlayer(this.user_id);
        this.nickname = nickname;
        this.avatar = avatar;
        this.seat_id = Number(seatId);

        if (!this.is_cur_player && shouLen) {
            shou = fill(Array(shouLen), '*');
        }
        /** UserStatusData */
        const user_status = userStatus + '';
        if (user_status === '4') {
            this.setStatus('speak');
        } else if (user_status === '6') {
            this.setStatus('die');
        } else {
            this.setStatus('normal');
        }
        this.updateCards(shou);

        if (this.is_cur_player) {
            this.beAnnoyCardsById(annoyCards);
        } else {
            this.beAnnoyCardsByIndex(annoyCardsIdx);
        }
        if (hasBlindEffect) {
            this.setBlindStatus(true);
        }
    }
    public updateCards(cards_info: CardData[]) {
        this.removeCards();
        if (!cards_info) {
            return;
        }
        for (const card_info of cards_info) {
            this.addCard(card_info + '');
        }
    }
    public addCard(card: string | CardModel, is_take = false) {
        if (!card) {
            return;
        }
        if (!(card instanceof CardModel)) {
            card = new CardModel(card);
        }
        card.setOwner(this);
        this.card_list.push(card);
        this.trigger(cmd.add_card, { card, is_take } as AddInfo);
    }
    public removeCard(card: CardModel) {
        const card_list = this.card_list;
        for (let len = card_list.length, i = len - 1; i >= 0; i--) {
            if (card_list[i] === card) {
                card_list.splice(i, 1);
            }
        }
    }
    private removeCards() {
        const { card_list } = this;
        for (let len = card_list.length, i = len - 1; i >= 0; i--) {
            card_list[i].destroy();
        }
        this.trigger(cmd.remove_cards);
    }
    private findCardByStatus(status: CardStatus) {
        const { card_list } = this;
        for (const card of card_list) {
            if (card.status === status) {
                return card;
            }
        }
    }
    public beAnnoyCardsById(card_id_list: string[]) {
        if (!card_id_list || !card_id_list.length) {
            return;
        }
        const { card_list } = this;
        for (const card_id of card_id_list) {
            for (const card of card_list) {
                if (card.is_beannoyed) {
                    continue;
                }
                if (card.card_id !== card_id + '') {
                    continue;
                }
                card.setAnnoyStatus(true);
                break;
            }
        }
    }
    public beAnnoyCardsByIndex(card_index_list: number[]) {
        if (!card_index_list || !card_index_list.length) {
            return;
        }
        const { card_list } = this;
        for (const card_index of card_index_list) {
            card_list[card_index].setAnnoyStatus(true);
        }
    }
    public setBlindStatus(status: boolean) {
        const { card_list } = this;
        for (const card of card_list) {
            card.setBlindStatus(status);
        }
        this.trigger(cmd.blind_status, { blind: status });
    }
    public clearBlindAndAnnoy() {
        const { card_list } = this;
        this.setBlindStatus(false);
        for (const card of card_list) {
            if (card.is_beannoyed === true) {
                card.setAnnoyStatus(false);
            }
        }
    }
    /** 从牌堆找出牌在调用discard， 返回cardModel给game用来展示在去拍区域 */
    public takeCardByStatus(card_id: string, status: CardStatus) {
        const card_list = this.card_list;
        let take_card = this.findCardByStatus(status);
        if (!take_card) {
            for (const card of card_list) {
                if (card.card_id === '*') {
                    card.updateInfo(card_id);
                    take_card = card;
                    break;
                }
                if (card.card_id === card_id) {
                    take_card = card;
                    break;
                }
            }
        }
        if (!take_card) {
            logErr(`cant find card_id=${card_id}|status=${status}`);
            return;
        }
        this.removeCard(take_card);
        if (status === 'wait_discard') {
            take_card.discard();
        } else {
            take_card.give();
        }
        return take_card;
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
            this.trigger(cmd.action, {
                observer,
                ...data,
            } as ObserverActionInfo);
        });
    }
    public isMyId(user_id: string) {
        return this.user_id === user_id + '';
    }
    /** 设置是否需要等待给牌 */
    public setWaitGiveStatus(status: boolean) {
        const { is_wait_give } = this;
        if (is_wait_give === status) {
            return;
        }
        this.is_wait_give = status;
    }
    public destroy() {
        this.removeCards();
        super.destroy();
    }
    /** 玩家失败 清除所有牌 */
    public exploding() {
        this.setStatus('die');
        this.removeCards();
    }
}
