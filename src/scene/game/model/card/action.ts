import { PlayerModel } from '../player';
import { CardModel } from './card';
import { log } from '../../../../mcTree/utils/zutil';
import { GameModel } from '../game';

type Data = {
    game: GameModel;
};
export type ActionDataInfo = PartialAll<HitData['hitInfo'], Data>;
export type ActionType = 'choose_target' | 'wait_get_card';
export type ActionStatus = 'act' | 'complete';

export abstract class Action {
    protected card: CardModel;
    /** 动作的作用 */
    public abstract act(data: ActionDataInfo);
    /** 动作完成 */
    public abstract complete(data: ActionDataInfo);
    constructor(card: CardModel) {
        this.card = card;
    }
}

export class ChooseTarget extends Action {
    private name = 'choose_target' as ActionType;
    private choose_list: PlayerModel[] = [];
    constructor(card: CardModel) {
        super(card);
    }
    public act(data: ActionDataInfo) {
        const { game, canChooseUserIds } = data;
        const { card } = this;
        const wait_arr = [];
        for (const id of canChooseUserIds) {
            const player = game.getPlayerById(id);
            const wait = player.actionAct(this.name);
            wait_arr.push(wait);
            this.choose_list.push(player);
        }
        Promise.race(wait_arr).then(user_id => {
            card.action({
                targetUserId: user_id,
            });
        });
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        const { choose_list } = this;
        for (const player of choose_list) {
            player.actionComplete(this.name);
        }
        log('complete', data);
    }
}

export class WaitGetCard extends Action {
    private name = 'wait_get_card' as ActionType;
    private target: PlayerModel;
    constructor(card: CardModel) {
        super(card);
    }
    public act(data: ActionDataInfo) {
        const { game, targetUserId } = data;
        const target = game.getPlayerById(targetUserId);
        target.actionAct(this.name);
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        log('result', data);
    }
}
