import { BaseEvent } from '../../../mcTmpl/event';
import { PlayerModel } from './player';

export const event = {
    add_player: 'add_player',
    status_change: 'status_change',
};

/** 游戏状态: 等待 开始 结束 */
export type GameStatus = 'init' | 'starting' | 'playing';
export const game_status_list = ['init', 'starting', 'playing'];
/** 游戏类型: 快速匹配 房主创建 */
export const game_type_list = ['init', 'starting', 'playing'];
export type GameType = 'quick_match' | 'host';

export class GameModel extends BaseEvent {
    /** 游戏类型 */
    public type: GameType;
    /** 游戏状态 */
    public status: GameStatus;
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
    /** 设计游戏类型 */
    public setGameType(type: GameType) {
        if (type === this.type) {
            return;
        }
        this.type = type;
    }
    /**  设置游戏状态 */
    public setGameStatus(status: GameStatus) {
        if (status === this.status) {
            return;
        }
        this.status = status;
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
