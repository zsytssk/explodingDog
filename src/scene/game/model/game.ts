import { BaseEvent } from '../../../mcTmpl/event';
import { PlayerModel } from './player';

export const Event = {
    add_player: 'add_player',
    remove_player: 'remove_player',
};
export class GameModel extends BaseEvent {
    private player_list: PlayerModel[] = [];
    /**  */
    public updatePlayers(players_data: UpdateUser['userList']) {}
    private addPlayer(player_data: UserData) {
        const player_model = new PlayerModel(player_data);
        this.trigger(Event.add_player);
    }
    private removePlayer(player: PlayerModel) {
        if (typeof player === 'string') {
            player = this.getPlayerById(player);
        }
        const index = this.player_list.indexOf(player);
        if (index === -1) {
            return;
        }
        this.player_list.splice(index, 1);
        this.trigger(Event.remove_player, { player });
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
}
