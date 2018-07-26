// tslint:disable:max-classes-per-file

import { race } from 'rxjs';
import { log } from '../../../../mcTree/utils/zutil';
import { GameModel } from '../game';
import { PlayerModel } from '../player';
import { ActionManager } from './actionManager';

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
    | 'reverse_arrows'
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
export class Action implements IAction {
    public manager: ActionManager;
    /** 动作的作用 */
    /** 动作完成 */
    constructor(manager: ActionManager) {
        this.manager = manager;
    }
    public act(data?) {
        //
    }
}

export class ChooseTarget extends Action {
    private name = 'choose_target' as ActionType;
    private choose_list: PlayerModel[] = [];
    constructor(manager: ActionManager) {
        super(manager);
    }
    public act(data: ActionDataInfo) {
        const { game, canChooseUserIds, player } = data;
        const { manager } = this;
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
            manager.sendAction({
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

export class WaitGetCard extends Action {
    private name = 'wait_get_card' as ActionType;
    constructor(manager: ActionManager) {
        super(manager);
    }
    public act(data: ActionDataInfo) {
        const { game, targetUserId } = data;
        const { manager } = this;
        const target = game.getPlayerById(targetUserId);
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
                manager.sendAction({
                    card: card_id,
                });
            });
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        const { game, targetUserId, player, card } = data;
        const target = game.getPlayerById(targetUserId);
        /** 非当前用户不需要选择 */
        if (!target) {
            return;
        }

        const card_model = target.takeCardByStatus(card, 'wait_give');
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
export class ShowDefuse extends Action {
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
            .subscribe();
        log('act', data);
    }
}

export class SeeTheFuture extends Action {
    private name = 'see_the_future' as ActionType;
    constructor(manager: ActionManager) {
        super(manager);
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

export class AlterTheFuture extends Action {
    private name = 'alter_the_future' as ActionType;
    constructor(manager: ActionManager) {
        super(manager);
    }
    public act(data: ActionDataInfo) {
        const { player } = data;
        const { manager } = this;
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
                manager.sendAction({
                    newSortCards,
                });
            });
        log('act', data);
    }
    public complete(data: ActionDataInfo) {
        const { player } = data;
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
    constructor(manager: ActionManager) {
        super(manager);
    }
    public act(data: ActionDataInfo) {
        const { game, targetUserId } = data;
        const target = game.getPlayerById(targetUserId);
        data.target = target;
        data.count = data.slapCount;
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
        player
            .beActioned({
                action: this.name,
                data,
                status: 'complete',
            })
            .subscribe();
    }
}

export class ReverseArrows extends Action {
    private name = 'reverse_arrows' as ActionType;
    public act(data: ActionDataInfo) {
        data.player
            .beActioned({
                action: this.name,
                status: 'act',
            })
            .subscribe();
    }
}
