// tslint:disable:max-classes-per-file

import { race } from 'rxjs';
import { log } from '../../../../mcTree/utils/zutil';
import { GameModel } from '../game';
import { PlayerModel } from '../player';
import { CardModel } from './card';

type Data = {
    count: number;
    game: GameModel;
    player?: PlayerModel;
    target?: PlayerModel;
};
export type ActionDataInfo = PartialAll<HitData['hitInfo'], Data>;
export type ActionType =
    | 'choose_target'
    | 'wait_get_card'
    | 'see_the_future'
    | 'alter_the_future'
    | 'show_defuse'
    | 'show_set_explode'
    | 'slap';
export type ActionStatus = 'act' | 'complete';
export type BeActionInfo = {
    action: ActionType;
    status: ActionStatus;
    data?: ActionDataInfo;
};
/** 发给服务器hit的数据结构 */
export type ActionSendData = {
    targetUserId?: string;
    newSortCards?: string[];
    card?: string;
};
// tslint:disable-next-line:interface-name
export interface IAction {
    /** 动作的作用 */
    act(data: ActionDataInfo);
    /** 动作完成 */
    complete?(data: ActionDataInfo);
}
export abstract class Action {
    public card: CardModel;
    /** 动作的作用 */
    /** 动作完成 */
    constructor(card: CardModel) {
        this.card = card;
    }
}

export class ChooseTarget extends Action implements IAction {
    private name = 'choose_target' as ActionType;
    private choose_list: PlayerModel[] = [];
    constructor(card: CardModel) {
        super(card);
    }
    public act(data: ActionDataInfo) {
        const { game, canChooseUserIds, player } = data;
        const { card } = this;
        const wait_arr = [];
        const { is_cur_player } = player;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }
        for (const id of canChooseUserIds) {
            const choose_player = game.getPlayerById(id);
            const wait = choose_player.beActioned({
                action: this.name,
                status: 'act',
            });
            wait_arr.push(wait);
            this.choose_list.push(choose_player);
        }
        race(wait_arr).subscribe((user_id: string) => {
            card.action({
                targetUserId: user_id,
            });
        });
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        const { is_cur_player } = data.player;
        const { choose_list } = this;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }
        for (const choose_player of choose_list) {
            choose_player
                .beActioned({
                    action: this.name,
                    status: 'complete',
                })
                .subscribe();
        }
        log('complete', data);
    }
}

export class WaitGetCard extends Action implements IAction {
    private name = 'wait_get_card' as ActionType;
    private target: PlayerModel;
    constructor(card: CardModel) {
        super(card);
    }
    public act(data: ActionDataInfo) {
        const { game, targetUserId } = data;
        const { card } = this;
        const target = game.getPlayerById(targetUserId);
        this.target = target;
        const { is_cur_player } = target;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }

        target
            .beActioned({
                action: this.name,
                status: 'act',
            })
            .subscribe((card_id: string) => {
                card.action({
                    card: card_id,
                });
            });
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        const { player, card } = data;
        const target = this.target;
        const { is_cur_player } = target;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }

        const card_model = target.giveCard(card);
        if (!player.is_cur_player) {
            card_model.updateInfo('*');
        }
        player.addCard(card_model);
        target
            .beActioned({
                action: this.name,
                status: 'complete',
            })
            .subscribe();
        log('complete', data);
    }
}
export class ShowDefuse extends Action implements IAction {
    public name = 'show_defuse' as ActionType;
    public act(data: ActionDataInfo) {
        const { player } = data;
        if (!player.is_cur_player) {
            // todo 面板显示
            return;
        }
        player
            .beActioned({
                action: this.name,
                data,
                status: 'act',
            })
            .subscribe((card_id: string) => {});
        log('act', data);
    }
    public complete() {}
}

export class SeeTheFuture extends Action implements IAction {
    private name = 'see_the_future' as ActionType;
    constructor(card: CardModel) {
        super(card);
    }
    public act(data: ActionDataInfo) {
        const { player } = data;
        const { is_cur_player } = player;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }

        player
            .beActioned({
                action: this.name,
                data,
                status: 'act',
            })
            .subscribe();
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        const { player, card } = data;
        const { is_cur_player } = player;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }

        player
            .beActioned({
                action: this.name,
                data,
                status: 'complete',
            })
            .subscribe();
        log('complete', data);
    }
}

export class AlterTheFuture extends Action implements IAction {
    private name = 'alter_the_future' as ActionType;
    constructor(card: CardModel) {
        super(card);
    }
    public act(data: ActionDataInfo) {
        const { player } = data;
        const { card } = this;
        const { is_cur_player } = player;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }

        player
            .beActioned({
                action: this.name,
                data,
                status: 'act',
            })
            .subscribe((newSortCards: string[]) => {
                card.action({
                    newSortCards,
                });
            });
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        const { player, card } = data;
        const { is_cur_player } = player;
        /** 非当前用户不需要选择 */
        if (!is_cur_player) {
            return;
        }

        player
            .beActioned({
                action: this.name,
                status: 'complete',
            })
            .subscribe();
        log('complete', data);
    }
}
export class Slap extends Action {
    private name = 'slap' as ActionType;
    constructor(card: CardModel) {
        super(card);
    }
    public act(data: ActionDataInfo) {
        const { game, targetUserId } = data;
        const { card_count } = this.card;
        const target = game.getPlayerById(targetUserId);
        data.target = target;
        data.count = card_count;
        target
            .beActioned({
                action: this.name,
                data,
                status: 'act',
            })
            .subscribe();
        log('act', data);
    }
}
export class ShowSetExplode extends Action {
    private name = 'show_set_explode' as ActionType;
    public act(data: ActionDataInfo) {
        const { player } = data;
        if (player.is_cur_player) {
            player
                .beActioned({
                    action: this.name,
                    status: 'act',
                })
                .subscribe();
        }
    }
    public complete(data: ActionDataInfo) {
        const { player } = data;
<<<<<<< HEAD
=======
        log('======================', player);
>>>>>>> 3bb1be665c3416c447e5c93c92dd47ee12773bc8
        if (player.is_cur_player) {
            player
                .beActioned({
                    action: this.name,
                    status: 'complete',
                })
                .subscribe();
        }
    }
}
