import { BaseEvent } from '../../../mcTree/event';

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
    constructor(card_id: string) {
        super();
        this.updateInfo(card_id);
    }
    public updateInfo(card_id: string) {
        this.card_id = card_id + '';
        this.trigger(cmd.update_info);
    }
    /** 真正的出牌前 需要记录状态 */
    public preDiscard() {
        this.is_prepare_discarded = true;
    }
    /** 真正的出牌 */
    public discard() {
        this.trigger(cmd.discard);
    }
    /** 取消出牌， 服务器返回数据错误 */
    public unDiscard() {
        this.is_prepare_discarded = false;
        this.trigger(cmd.un_discard);
    }
}
