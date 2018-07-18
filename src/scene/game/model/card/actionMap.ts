import {
    ChooseTarget,
    WaitGetCard,
    ShowDefuse,
    SeeTheFuture,
    AlterTheFuture,
    showSetExplode,
} from './action';

export const action_map = {
    alter_the_future: [AlterTheFuture],
    exploding: [ShowDefuse],
    defuse: [showSetExplode],
    see_the_future: [SeeTheFuture],
    steal: [ChooseTarget, WaitGetCard],
};
