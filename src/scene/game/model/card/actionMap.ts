import {
    ChooseTarget,
    WaitGetCard,
    ShowDefuse,
    SeeTheFuture,
    AlterTheFuture,
    showSetExplorde,
} from './action';

export const action_map = {
    alter_the_future: [AlterTheFuture],
    exploding: [ShowDefuse],
    defuse: [showSetExplorde],
    see_the_future: [SeeTheFuture],
    steal: [ChooseTarget, WaitGetCard],
};
