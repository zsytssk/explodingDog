import {
    IAction,
    ActionDataInfo,
    Action,
    ActionSendData,
    WaitGetCard,
} from './action';
import { action_map } from './actionMap';
import { CardModel } from './card';

export class ActionManager {
    private actions: IAction[];
    private cur_step: number;
    private card: CardModel;
    constructor(card: CardModel) {
        this.card = card;
        this.init();
    }
    private init() {
        const { card_type } = this.card;
        const actions_ori = action_map[card_type] as Array<
            new (man: ActionManager) => Action
        >;
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
    public update(action_info: ActionDataInfo) {
        const { actions } = this;

        if (!actions) {
            return;
        }
        const step = action_info.step - 1;
        const pre_action = actions[this.cur_step];
        const cur_action = actions[step];
        /** 前一个结束 */
        if (pre_action && pre_action.complete) {
            pre_action.complete(action_info);
        }
        if (cur_action) {
            cur_action.act(action_info);
        }
        this.cur_step = step;
    }
    public sendAction(data: ActionSendData) {
        this.card.sendAction(data);
    }
}
