import {
    ChooseTarget,
    WaitGetCard,
    ShowDefuse,
    SeeTheFuture,
    AlterTheFuture,
    ShowSetExplode,
    Slap,
    ReverseArrows,
    Annoy,
    Blind,
    FinishSetExplode
} from './action';

export const action_map = {
    alter_the_future: [AlterTheFuture],
    annoy: [ChooseTarget, Annoy],
    blind: [ChooseTarget, Blind],
    defuse: [ShowSetExplode, FinishSetExplode],
    exploding: [ShowDefuse],
    reverse: [ReverseArrows],
    see_the_future: [SeeTheFuture],
    slap: [ChooseTarget, Slap],
    slef_slap: [ChooseTarget, Slap],
    steal: [ChooseTarget, WaitGetCard],
};
