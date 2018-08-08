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
    FinishSetExplode,
} from './action';

export const action_map = {
    alter_future: [AlterTheFuture],
    annoy: [ChooseTarget, Annoy],
    blind: [ChooseTarget, Blind],
    bomb: [ShowDefuse],
    defuse: [ShowSetExplode, FinishSetExplode],
    reverse: [ReverseArrows],
    see_future: [SeeTheFuture],
    self_slap: [ChooseTarget, Slap],
    slap: [ChooseTarget, Slap],
    steal: [ChooseTarget, WaitGetCard],
};
