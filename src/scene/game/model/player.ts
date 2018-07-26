import { fill } from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { BaseEvent } from '../../../mcTree/event';
import { CardModel, CardStatus } from './card/card';
import { BeActionInfo } from './card/action';
import { isCurPlayer } from '../../../utils/tool';
import { logErr } from '../../../mcTree/utils/zutil';

export type PlayerStatus = 'speak' | 'wait_give' | 'die' | 'normal';
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
        } = player_data;
        let { shou } = player_data;

        this.user_id = userId;
        if (isCurPlayer(this.user_id)) {
            this.is_cur_player = true;
        }
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
        if (annoyCards) {
            this.beAnnoyCardsById(annoyCards);
        } else if (annoyCardsIdx) {
            this.beAnnoyCardsByIndex(annoyCardsIdx);
        }
        this.updateCards(shou);
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
            }
        }
    }
    public beAnnoyCardsByIndex(card_index_list: number[]) {
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
        if (status === 'discard') {
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
            const { status, action } = data;
            if (action === 'wait_get_card') {
                if (status === 'act') {
                    this.setStatus('wait_give');
                } else {
                    this.setStatus('normal');
                }
            } else if (action === 'annoy') {
                if (this.is_cur_player) {
                    this.beAnnoyCardsById(data.data.newAnnoyCards);
                } else {
                    this.beAnnoyCardsByIndex(data.data.annoyCardsIdx);
                }
            } else if (action === 'blind') {
                this.setBlindStatus(true);
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
