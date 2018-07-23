import { BaseEvent } from '../../../mcTree/event';
import { PlayerModel } from './player';
import { CardModel } from './card/card';
import { logErr } from '../../../mcTree/utils/zutil';
import * as fill from 'lodash/fill';
import { TURN_CHANGE_ID } from '../../../data/card';

export const cmd = {
    add_player: 'add_player',
    card_type_change: 'card_type_change',
    discard_card: 'discard_card',
    status_change: 'status_change',
    update_bill_board: 'update_bill_board',
    update_turn_arrows: 'update_turn_arrows'
};

/** 牌的类型  */
export type CardType = ValOfObj<typeof CARD_TYPE>;
export const CARD_TYPE = {
    NORMAL: 1,
    CRAZY: 2, // tslint:disable-line:object-literal-sort-keys
    DANCE: 3,
};
/** 游戏状态: 等待 开始 结束 */
export type GameStatus = ValOfObj<typeof GAME_STATUS>;
export const GAME_STATUS = {
    /** 初始化 */
    INIT: 0,
    STARTING: 2,
    PLAYING: 3, // tslint:disable-line:object-literal-sort-keys
};
export type GameType = ValOfObj<typeof GAME_TYPE>;
/** 游戏类型: 快速匹配 房主创建 */
export const GAME_TYPE = {
    QUICK_MATCH: 0,
    HOST: 1, // tslint:disable-line:object-literal-sort-keys
};

/** 游戏的方向 */
export const GAME_DIRECTION = {
    ANTI_CLOCKWISE: 1,
    CLOCKWISE: 0,
};

export class GameModel extends BaseEvent {
    /** 游戏类型 */
    public game_type: GameType;
    /**  牌组类型 */
    public card_type: CardType;
    /** 游戏状态 */
    public status: GameStatus;
    public room_id: string;
    public remain_num: number;
    public direction: DirectionData;
    private player_list: PlayerModel[] = [];
    /** 正在出的牌 */
    private discard_card: CardModel;
    /** 准备出的牌 */
    private pre_discard_card: CardModel;
    /** 游戏复盘 */
    public gameReplay(data: GameReplayData) {
        /** 还未加入房间, 要显示当前用户信息, 将当前用户添加到数组中... */
        if (data.curUserInfo) {
            this.addPlayer(data.curUserInfo, true);
        }
        if (!data.userList.length) {
            data.userList.push(data.curUserInfo);
        }
        this.updatePlayers(data.userList);

        this.setRoomInfo(data.roomInfo);
        this.setRoundInfo(data.roundInfo);
    }
    /** 更新用户信息 */
    public updatePlayers(players_data: UpdateUser['userList']) {
        const user_id_list = [];
        for (const player_data of players_data) {
            const user_id = player_data.userId;
            user_id_list.push(user_id);
            /** 用户已经存在不做处理 */
            const player_model = this.getPlayerById(user_id);
            if (player_model) {
                player_model.updateInfo(player_data);
                continue;
            }
            this.addPlayer(player_data);
        }
        /** 删除已经存在的user */
        for (const player_model of this.player_list) {
            if (user_id_list.indexOf(player_model.user_id) !== -1) {
                continue;
            }
            this.removePlayer(player_model);
        }
    }
    private addPlayer(player_data: UserData, is_cur = false) {
        const player = new PlayerModel(player_data, is_cur);
        this.player_list.push(player);
        /** 保证在所有用户的信息都完成之后再去执行 */
        this.trigger(cmd.add_player, { player });
    }
    public removePlayer(player: PlayerModel | string) {
        if (typeof player === 'string') {
            player = this.getPlayerById(player);
        }
        const index = this.player_list.indexOf(player);
        if (index === -1) {
            return;
        }
        this.player_list.splice(index, 1);
        player.destroy();
    }
    /** 设置房间信息 */
    public setRoomInfo(data: RoomInfoData) {
        const type_no = data.isUserCreate || 0;
        const status_no = Number(data.roomStatus);
        const card_no = Number(data.cardType);
        this.room_id = data.roomId;
        this.game_type = GAME_TYPE[type_no] as GameType;
        this.setCardType(card_no);
        this.setGameStatus(status_no);
    }
    /**  设置游戏状态 */
    public setGameStatus(status: GameStatus) {
        if (status === this.status) {
            return;
        }
        this.status = status;
        this.trigger(cmd.status_change, { status });
    }
    /**  设置游戏状态 */
    public setCardType(card_type: CardType) {
        if (card_type === this.card_type) {
            return;
        }
        this.card_type = card_type;
        this.trigger(cmd.card_type_change, { card_type });
    }
    /** 设置房间信息 */
    private setRoundInfo(data: RoundInfoData) {
        if (!data) {
            return;
        }
        this.setSpeaker(data.speakerId);
        this.remain_num = data.remainCard;
        this.direction = data.turnDirection;
        this.trigger(cmd.update_turn_arrows, data.turnDirection);
        const hit_data = data.hitData;
        if (hit_data) {
            const { hitCard, hitInfo, hitUserId } = hit_data;
            if (!hitInfo) {
                return;
            }
            hitInfo.discard = 0;
            this.discardCard({
                hitCard,
                hitInfo,
                hitUserId,
            });
        }
    }
    public setSpeaker(speak_id: string) {
        const player_list = this.player_list;
        for (const player of player_list) {
            if (player.isMyId(speak_id)) {
                player.setStatus('speak');
                this.trigger(cmd.update_bill_board, {
                    fromUser: player,
                    cardId: TURN_CHANGE_ID
                });
            } else {
                player.setStatus('normal');
            }
        }
    }
    public updatePlayersCards(data: GameStartData) {
        const { userList, shou } = data;
        for (const user of userList) {
            const player = this.getPlayerById(user.userId);
            if (player.is_cur_player) {
                player.updateCards(shou);
            } else {
                player.updateCards(fill(Array(user.shouLen), '*'));
            }
        }
    }
    public addPlayerCard(data: TakeData) {
        const player = this.getPlayerById(data.userId);
        player.addCard(data.takeCard);
    }
    public getPlayerById(id: string) {
        const player_list = this.player_list;
        for (const player of player_list) {
            if (player.isMyId(id)) {
                return player;
            }
        }
        return;
    }
    public discardCard(data: HitData) {
        /** 清理原来出的牌 */
        const { discard_card } = this;
        const player = this.getPlayerById(data.hitUserId);
        const hit_info = data.hitInfo;
        const hit_card = data.hitCard;

        if (!hit_info) {
            return;
        }
        if (!player) {
            logErr(`cant find player for ${data.hitUserId}`);
            return;
        }
        const need_discard = hit_info.discard === 1;

        let card;
        if (need_discard) {
            card = player.discardCard(hit_card);
        }
        /** 这地方乱需要整理下， 这逻辑都是抽出来的 */
        if (!card) {
            if (!discard_card) {
                card = new CardModel(hit_card);
                this.trigger(cmd.discard_card, { card });
            } else {
                card = discard_card;
            }
        } else if (this.discard_card) {
            this.discard_card.destroy();
            this.discard_card = undefined;
        }
        /** 更新action */
        card.updateAction({
            ...hit_info,
            game: this,
            player,
        });
        this.discard_card = card;
        //更新billboard
        let targetPlayer = null;
        if (hit_info.targetUserId) {
            targetPlayer = this.getPlayerById(hit_info.targetUserId);
        }
        switch (data.hitCard) {
            default:
                this.trigger(cmd.update_bill_board, {
                    fromUser: player,
                    toUser: targetPlayer,
                    cardId: data.hitCard,
                    step: hit_info.step
                });
                break;
        }
    }
    public unDiscardCard(data: HitData) {
        const player = this.getPlayerById(data.userId);
        player.unDiscardCard();
    }
    public getPlayerNum() {
        return this.player_list.length;
    }
}
