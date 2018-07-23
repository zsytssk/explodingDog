import {
    ChooseTarget,
    WaitGetCard,
    ShowDefuse,
    SeeTheFuture,
    AlterTheFuture,
    ShowSetExplode,
    Slap,
    ReverseArrows,
} from './action';

export const action_map = {
    alter_the_future: [AlterTheFuture],
    defuse: [ShowSetExplode],
    exploding: [ShowDefuse],
    reverse: [ReverseArrows],
    see_the_future: [SeeTheFuture],
    slap: [ChooseTarget, Slap],
    slef_slap: [ChooseTarget, Slap],
    steal: [ChooseTarget, WaitGetCard],
};
