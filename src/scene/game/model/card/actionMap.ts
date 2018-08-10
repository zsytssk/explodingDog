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
import { CARD_NAME } from '../../../../data/card';

export const action_map = {
    [CARD_NAME.ALTER_FUTURE]: [AlterTheFuture],
    [CARD_NAME.ANNOY]: [ChooseTarget, Annoy],
    [CARD_NAME.BLIND]: [ChooseTarget, Blind],
    [CARD_NAME.BOMB]: [ShowDefuse],
    [CARD_NAME.DEFUSE]: [ShowSetExplode, FinishSetExplode],
    [CARD_NAME.REVERSE]: [ReverseArrows],
    [CARD_NAME.SEE_FUTURE]: [SeeTheFuture],
    [CARD_NAME.SELF_SLAP]: [Slap],
    [CARD_NAME.SLAP]: [ChooseTarget, Slap],
    [CARD_NAME.STEAL]: [ChooseTarget, WaitGetCard],
};
