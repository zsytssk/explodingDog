// tslint:disable:max-classes-per-file

import { race } from 'rxjs';
import { log } from '../../../../mcTree/utils/zutil';
import { GameModel } from '../game';
import { PlayerModel } from '../player';
import { CardModel } from './card';

type Data = {
    game: GameModel;
    player?: PlayerModel;
};
export type ActionDataInfo = PartialAll<HitData['hitInfo'], Data>;
export type ActionType =
    | 'choose_target'
    | 'wait_get_card'
    | 'see_the_future'
    | 'alter_the_future'
    | 'show_defuse';
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

export class WaitGetCard extends Action {
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
                status: 'act',
                data
            })
            .subscribe((card_id: string) => { });
        log('act', data);
    }
    public complete() { }
}

export class SeeTheFuture extends Action {
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

export class AlterTheFuture extends Action {
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

export class showSetExplode extends Action {
    private name = 'show_set_explode';
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
        log('======================', player)
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
