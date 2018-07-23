import { BaseEvent } from '../../../../mcTree/event';
import { PlayerModel } from '../player';
import { getCardInfo } from '../../../../utils/tool';
import { IAction, ActionDataInfo, ActionSendData } from './action';
import { action_map } from './actionMap';
import { logErr } from '../../../../mcTree/utils/zutil';

export type CardStatus = 'normal' | 'discard' | 'wait_give' | 'exploding';
export const cmd = {
    action_send: 'action_send',
    discard: 'discard',
    give: 'give',
    un_discard: 'un_discard',
    update_info: 'update_info',
};

export class CardModel extends BaseEvent {
    /** 牌的id */
    public card_id: string;
    /** 牌的类型名称 */
    public card_type: string;
    /** 牌的执行数目 */
    public card_count: number;
    /** 所属者 */
    public owner: PlayerModel;
    public status: CardStatus = 'normal';
    /** 动作列表 */
    public actions: IAction[];
    constructor(card_id: string) {
        super();
        this.updateInfo(card_id);
    }
    public updateInfo(card_id: string) {
        card_id += '';
        this.card_id = card_id;

        if (card_id === '*') {
            return;
        }
        const { type, count } = getCardInfo(card_id);
        this.card_type = type;
        this.card_count = count;

        this.initAction();
        this.trigger(cmd.update_info);
    }
    public setOwner(owner: PlayerModel) {
        this.owner = owner;
    }
    private initAction() {
        const { card_type } = this;
        const actions_ori = action_map[card_type];
        if (!actions_ori) {
            return;
        }
        const actions = [] as IAction[];
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
        if (pre_action && pre_action.complete) {
            pre_action.complete(action_info);
        }
        if (cur_action) {
            cur_action.act(action_info);
        }
    }
    /** 真正的出牌前 需要记录状态 */
    public preDiscard(): CardStatus {
        const { status: owner_status } = this.owner;
        let status = 'normal' as CardStatus;
        /** 偷牌 */
        if (owner_status === 'wait_give') {
            status = 'wait_give';
        }
        /** 出牌 */
        if (owner_status === 'speak') {
            status = 'discard';
        }
        this.status = status;
        return status;
    }
    /** 真正的出牌 */
    public discard() {
        this.trigger(cmd.discard);
    }
    /** 真正的出牌 */
    public give() {
        this.trigger(cmd.give);
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
        if (this.status === 'discard') {
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
    public canGive(card_id: string) {
        if (this.card_id === '*') {
            this.updateInfo(card_id);
            return true;
        }
        if (this.status === 'wait_give') {
            return true;
        }
        return false;
    }
    public action(data: ActionSendData) {
        this.trigger(cmd.action_send, { ...data });
    }
    /** 取消出牌， 服务器返回数据错误 */
    public unDiscard() {
        if (this.status !== 'discard') {
            return;
        }
        this.status = 'normal';
        this.trigger(cmd.un_discard);
    }
    public destroy() {
        /** 从所有者中移除自己 */
        if (this.owner) {
            this.owner.removeCard(this);
            this.owner = undefined;
        }
        super.destroy();
    }
}
