import { ChooseTarget, WaitGetCard, ShowDefuse, showSetExplorde } from './action';

export const action_map = {
    steal: [ChooseTarget, WaitGetCard],
    exploding: [ShowDefuse],
    defuse: [showSetExplorde],
};
