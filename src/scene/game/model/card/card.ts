import { BaseEvent } from '../../../../mcTree/event';
import { PlayerModel } from '../player';
import { GameModel } from '../game';
import { getCardInfo } from '../../../../utils/tool';
import { Action, ActionDataInfo } from './action';
import { action_map } from './actionMap';
import { logErr } from '../../../../mcTree/utils/zutil';

export const cmd = {
    action_send: 'action_send',
    discard: 'discard',
    un_discard: 'un_discard',
    update_info: 'update_info',
};
export type ActionData = HitData['hitInfo'];
export class CardModel extends BaseEvent {
    /** 牌的id */
    public card_id: string;
    /** 牌的类型名称 */
    private card_type: string;
    /** 是否被出牌 */
    public is_prepare_discarded = false;
    /** 所属者 */
    public owner: PlayerModel;
    /** 动作列表 */
    private actions: Action[];
    constructor(card_id: string, player?: PlayerModel) {
        super();
        this.owner = player;
        this.updateInfo(card_id);
    }
    public updateInfo(card_id: string) {
        card_id += '';
        this.card_id = card_id;

        if (card_id === '*') {
            return;
        }
        const { type } = getCardInfo(card_id);
        this.card_type = type;

        this.initAction();
        this.trigger(cmd.update_info);
    }
    private initAction() {
        const { card_type } = this;
        const actions_ori = action_map[card_type];
        if (!actions_ori) {
            return;
        }
        const actions = [] as Action[];
        // tslint:disable-next-line:variable-name
        for (const ActionCreate of actions_ori) {
            actions.push(new ActionCreate(this));
        }
        this.actions = actions;
    }
    /** 更新技能信息 */
    public updateAction(action_info: ActionDataInfo) {
        const { actions } = this;
        if (!actions) {
            return;
        }
        const step = action_info.step - 1;
        const pre_action = actions[step - 1];
        const cur_action = actions[step];
        /** 前一个结束 */
        if (pre_action) {
            pre_action.complete(action_info);
        }
        if (cur_action) {
            cur_action.act(action_info);
        }
    }
    /** 真正的出牌前 需要记录状态 */
    public preDiscard() {
        const player = this.owner;
        if (player.status !== 'speak') {
            return false;
        }
        this.is_prepare_discarded = true;
        return true;
    }
    /** 真正的出牌 */
    public discard() {
        this.trigger(cmd.discard);
    }
    /** 能够被打出
     * ! 1. 其他玩家的都牌可以打出
     * ! 2. 炸弹可以打出
     *   当前玩家炸弹 服务器自动打出 不需要前端的动作
     * ! 3. 在本地已经打出的牌
     */
    public canDiscard(card_id: string) {
        if (this.card_id === '*') {
            this.updateInfo(card_id);
            return true;
        }
        if (this.is_prepare_discarded) {
            if (this.card_id !== card_id + '') {
                logErr(`card card_id not equal ${card_id}`);
            }
            return true;
        }
        if (this.card_type === 'exploding') {
            return true;
        }
        return false;
    }
    public action(data: ActionData) {
        this.trigger(cmd.action_send, { ...data });
    }
    /** 取消出牌， 服务器返回数据错误 */
    public unDiscard() {
        this.is_prepare_discarded = false;
        this.trigger(cmd.un_discard);
    }
}
