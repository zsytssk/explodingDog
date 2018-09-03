import { fill } from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { BaseEvent } from '../../../mcTree/event';
import { logErr } from '../../../mcTree/utils/zutil';
import { isCurPlayer } from '../../../utils/tool';
import { BeActionInfo } from './card/action';
import { CardModel, DrawType } from './card/card';

export type PlayerStatus = 'speak' | 'wait_give' | 'die' | 'normal';
export const cmd = {
    /** 动作信息 */
    action: 'action',
    add_card: 'add_card',
    blind_status: 'blind_status',
    draw_card: 'draw_card',
    pre_draw_card: 'pre_draw_card',
    remove_cards: 'remove_cards',
    status_change: 'status_change',
    wait_choose: 'wait_choose',
    creator_change: 'creator_change'
};
export type BlindStatus = {
    is_blind: boolean;
    play_ani: boolean;
};
/** 动作的信息 */
export type ObserverActionInfo = PartialAll<
    BeActionInfo,
    {
        /** 动作执行的resolve */
        observer?: Subscriber<string | string[]>;
    }
    >;

/* 牌的来源 抓 | 别人给的 | 牌堆里的 */
export type CardFrom = 'take' | 'give' | 'cards';

/** 拿牌的信息 */
export type AddInfo = {
    card: CardModel;
    from: CardFrom;
};

export class PlayerModel extends BaseEvent {
    public is_cur_player: boolean;
    public is_creator: boolean;
    public seat_id: number;
    public user_id: string;
    public nickname: string;
    public avatar: string;
    /** 正在出牌 */
    public status: PlayerStatus;
    public card_list: CardModel[] = [];
    protected is_blind: boolean = false;
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
    public setCreator(isCreator: boolean) {
        if (this.is_creator != isCreator) {
            this.trigger(cmd.creator_change, { isCreator });
        }
    }
    public setStatus(status: PlayerStatus) {
        if (status === this.status) {
            return;
        }
        this.status = status;
        this.trigger(cmd.status_change, { status });
    }
    public updateCards(cards_info: CardData[]) {
        this.removeCards();
        if (!cards_info) {
            return;
        }
        for (const card_info of cards_info) {
            this.addCard(card_info + '', 'cards');
        }
    }
    public addCard(card: string | CardModel, from: CardFrom) {
        if (!card) {
            return;
        }
        if (!(card instanceof CardModel)) {
            card = new CardModel(card);
        }
        card.setOwner(this);
        if (this.is_blind) {
            card.setBlindStatus(true, true);
        }
        this.card_list.push(card);
        this.trigger(cmd.add_card, { card, from } as AddInfo);
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
    public preDrawCard(card: CardModel): boolean {
        let can_draw = false;
        if (this.status === 'wait_give') {
            can_draw = true;
        } else if (this.status === 'speak') {
            can_draw = true;
        }
        this.trigger(cmd.pre_draw_card, { card });
        return can_draw;
    }
    private findPreDrawCard(card_id) {
        const { card_list } = this;
        for (const card of card_list) {
            if (card.pre_drawed && card.card_id == card_id) {
                return card;
            }
        }
    }
    /**弹出指定id的卡牌 */
    public showCardTip(cardId: string, showBlind: boolean = true) {
        for (const card of this.card_list) {
            if (card.be_annoyed) {
                continue;
            }
            if (!showBlind && card.is_blind) {
                continue;
            }
            if (card.card_id === cardId) {
                card.showTip()
                break;
            }
        }
    }
    /** 从牌堆找出牌在调用discard， 返回cardModel给game用来展示在去拍区域 */
    public drawCard(card_id: string, type: DrawType) {
        const card_list = this.card_list;
        let pre_draw_card = this.findPreDrawCard(card_id);
        if (!pre_draw_card) {
            for (const card of card_list) {
                if (card.be_annoyed) {
                    continue;
                }
                if (card.card_id === '*') {
                    if (card_id) {
                        card.updateInfo(card_id);
                    }
                    pre_draw_card = card;
                    break;
                }
                if (card.card_id === card_id) {
                    pre_draw_card = card;
                    break;
                }
            }
        }
        if (!pre_draw_card) {
            logErr(`cant find card_id=${card_id}`);
            return;
        }
        pre_draw_card.draw(type);
        this.trigger(cmd.draw_card, { card: pre_draw_card });
        this.removeCard(pre_draw_card);
        return pre_draw_card;
    }
    /** 取消出牌 */
    public unDrawCard() {
        const card_list = this.card_list;
        /** 非当前用户 不需要处理 */
        if (!this.is_cur_player) {
            return;
        }
        /** 当前用户还原出的状态 */
        for (const card of card_list) {
            card.unDraw();
        }
    }
    public beActioned(data: BeActionInfo): Observable<string | string[]> {
        return new Observable(observer => {
            this.trigger(cmd.action, {
                observer,
                ...data,
            } as ObserverActionInfo);
        });
    }
    public beAnnoyCardsById(card_id_list: string[]) {
        if (!card_id_list || !card_id_list.length) {
            return;
        }
        const { card_list } = this;
        for (const card_id of card_id_list) {
            for (const card of card_list) {
                if (card.be_annoyed) {
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
    /**
     *
     * @param status
     * @param play_ani 是否播放洗牌动画 replay时不播
     */
    public setBlindStatus(status: boolean, play_ani = false) {
        const { card_list } = this;
        this.is_blind = status;
        for (const card of card_list) {
            card.setBlindStatus(status);
        }
        this.trigger(cmd.blind_status, {
            is_blind: status,
            play_ani,
        } as BlindStatus);
    }
    public clearBlindAndAnnoy() {
        const { card_list } = this;
        this.setBlindStatus(false);
        for (const card of card_list) {
            if (card.be_annoyed === true) {
                card.setAnnoyStatus(false);
            }
        }
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
