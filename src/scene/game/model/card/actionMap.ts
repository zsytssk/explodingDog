import {
    ChooseTarget,
    WaitGetCard,
    ShowDefuse,
    SeeTheFuture,
    AlterTheFuture,
} from './action';

export const action_map = {
    alter_the_future: [AlterTheFuture],
    exploding: [ShowDefuse],
    see_the_future: [SeeTheFuture],
    steal: [ChooseTarget, WaitGetCard],
};
