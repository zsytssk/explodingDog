import {
    ChooseTarget,
    WaitGetCard,
    ShowDefuse,
    SeeTheFuture,
    AlterTheFuture,
    showSetExplorde,
    Slap,
} from './action';

export const action_map = {
    alter_the_future: [AlterTheFuture],
    defuse: [showSetExplorde],
    exploding: [ShowDefuse],
    see_the_future: [SeeTheFuture],
    slap: [ChooseTarget, Slap],
    slef_slap: [ChooseTarget, Slap],
    steal: [ChooseTarget, WaitGetCard],
};
