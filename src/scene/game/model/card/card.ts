import { BaseEvent } from '../../../../mcTree/event';
import { PlayerModel } from '../player';
import { getCardInfo } from '../../../../utils/tool';
import { ActionDataInfo, ActionSendData } from './action';
import { ActionManager } from './actionManager';

export const cmd = {
    action_send: 'action_send',
    annoy_status: 'annoy_status',
    blind_status: 'blind_status',
    draw: 'draw',
    un_draw: 'un_discard',
    update_info: 'update_info',
};

/** 出牌的两种状态 给|打出 */
export type DrawType = 'discard' | 'give';

export type AnnoyStatus = { be_annoyed: boolean };
export type BlindStatus = { is_blind: boolean };
export class CardModel extends BaseEvent {
    /** 牌的id */
    public card_id: string;
    /** 牌的类型名称 */
    public card_type: string;
    /** 牌的执行数目 */
    public card_count: number;
    public is_blind = false;
    public be_annoyed = false;
    /** 所属者 */
    public owner: PlayerModel;
    private action_manager: ActionManager;
    public pre_drawed = false;
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

        this.action_manager = new ActionManager(this);
        this.trigger(cmd.update_info);
    }
    public setOwner(owner: PlayerModel) {
        this.owner = owner;
    }
    /** 更新技能信息 */
    public updateAction(action_info: ActionDataInfo) {
        this.action_manager.update(action_info);
    }
    /** 真正的出牌前 需要记录状态 */
    public preDrawCard(): boolean {
        if (this.be_annoyed) {
            return false;
        }
        const pre_drawed = this.owner.preDrawCard(this);
        if (pre_drawed) {
            this.pre_drawed = true;
        }
        return pre_drawed;
    }
    public draw(type: DrawType) {
        this.pre_drawed = false;
        this.trigger(cmd.draw, { type });
        this.setBlindStatus(false);
    }
    /** 取消出牌， 服务器返回数据错误 */
    public unDraw() {
        if (!this.pre_drawed) {
            return;
        }
        this.pre_drawed = false;
        this.trigger(cmd.un_draw);
    }
    public sendAction(data: ActionSendData) {
        this.trigger(cmd.action_send, { ...data });
    }
    public setBlindStatus(status: boolean, is_trigger = true) {
        if (status === this.is_blind) {
            return;
        }
        this.is_blind = status;
        if (is_trigger) {
            this.trigger(cmd.blind_status, { is_blind: status } as BlindStatus);
        }
    }
    public setAnnoyStatus(status: boolean, is_trigger = true) {
        if (status === this.be_annoyed) {
            return;
        }
        this.be_annoyed = status;
        if (is_trigger) {
            this.trigger(cmd.annoy_status, {
                be_annoyed: status,
            } as AnnoyStatus);
        }
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
