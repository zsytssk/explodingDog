import { BaseEvent } from '../../../mcTmpl/event';
import { PlayerModel } from './player';

export const event = {
    add_player: 'add_player',
    status_change: 'status_change',
    card_type_change: 'card_type_change',
};

/** 牌的类型  */
export type CardType = 'normal' | 'crazy' | 'dance';
export const card_type_map = {
    0: 'normal',
    1: 'crazy',
    2: 'dance',
};
/** 游戏状态: 等待 开始 结束 */
export type GameStatus = 'init' | 'starting' | 'playing';
export const game_status_map = {
    0: 'init',
    2: 'starting',
    3: 'playing',
};
export type GameType = 'quick_match' | 'host';
/** 游戏类型: 快速匹配 房主创建 */
export const game_type_map = {
    0: 'quick_match',
    1: 'host',
};

export class GameModel extends BaseEvent {
    /** 游戏类型 */
    public game_type: GameType;
    /**  牌组类型 */
    public card_type: CardType;
    /** 游戏状态 */
    public status: GameStatus;
    public room_id: string;
    private player_list: PlayerModel[] = [];
    /** 更新用户信息 */
    public updatePlayers(players_data: UpdateUser['userList']) {
        for (const player_data of players_data) {
            this.addPlayer(player_data);
        }
    }
    private addPlayer(player_data: UserData) {
        const player = new PlayerModel(player_data);
        this.trigger(event.add_player, { player });
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
        const status_no = data.roomStatus;
        const card_no = data.cardType;
        this.room_id = data.roomId;
        this.game_type = game_type_map[type_no] as GameType;
        this.card_type = card_type_map[card_no] as CardType;
        this.setGameStatus(game_status_map[status_no] as GameStatus);
    }
    /**  设置游戏状态 */
    public setGameStatus(status: GameStatus) {
        if (status === this.status) {
            return;
        }
        this.status = status;
        this.trigger(event.status_change, { status });
    }
    /**  设置游戏状态 */
    public setCardType(card_type: CardType) {
        if (status === this.status) {
            return;
        }
        this.card_type = card_type;
        this.trigger(event.card_type_change, { card_type });
    }
    public getPlayerById(id: string) {
        const player_list = this.player_list;
        for (const player of player_list) {
            if (player.user_id === id) {
                return player;
            }
        }
        return null;
    }
    public getPlayerNum() {
        return this.player_list.length;
    }
}
