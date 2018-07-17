import { ChooseTarget, WaitGetCard, ShowDefuse } from './action';

export const action_map = {
    steal: [ChooseTarget, WaitGetCard],
    exploding: [ShowDefuse],
};
