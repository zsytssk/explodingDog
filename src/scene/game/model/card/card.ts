import { BaseEvent } from '../../../../mcTree/event';
import { PlayerModel } from '../player';
import { getCardInfo } from '../../../../utils/tool';
import { logErr } from '../../../../mcTree/utils/zutil';

export const cmd = {
    discard: 'discard',
    un_discard: 'un_discard',
    update_info: 'update_info',
};
export class CardModel extends BaseEvent {
    /** 牌的id */
    public card_id: string;
    /** 牌的操作次数 */
    public card_count: number;
    /** 是否被出牌 */
    public is_prepare_discarded = false;
    /** 所属的玩家 */
    public owner: PlayerModel;
    private actions;
    constructor(card_id: string, player?: PlayerModel) {
        super();
        this.owner = player;
        this.updateInfo(card_id);
    }
    public updateInfo(card_id: string) {
        this.card_id = card_id + '';
        this.trigger(cmd.update_info);
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
        const card_info = getCardInfo(this.card_id);
        if (card_info.type === 'exploding') {
            return true;
        }
        return false;
    }
    /** 取消出牌， 服务器返回数据错误 */
    public unDiscard() {
        this.is_prepare_discarded = false;
        this.trigger(cmd.un_discard);
    }
}
