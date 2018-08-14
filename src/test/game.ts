import { GameCtrl } from '../scene/game/main';
import { default as GameReplayData } from './serverData/gameReplay.json';
import { default as GameStartData } from './serverData/gameStart.json';
import { default as updateUserData } from './serverData/updateUser.json';
import { default as hitData } from './serverData/hit.json';
import { default as StealData } from './serverData/steal.json';
import { default as TakeData } from './serverData/take.json';
import { default as AnnoyData } from './serverData/annoy.json';
import { default as BlindData } from './serverData/blind.json';
import { default as AlterTheFutureData } from './serverData/alterTheFuture.json';
import { default as SeeTheFutureData } from './serverData/seeTheFuture.json';
import { default as userExplodingData } from './serverData/userExploding.json';
import { default as gameOverData } from './serverData/gameOver.json';
import { CardModel } from '../scene/game/model/card/card';
import { CARD_MAP } from '../data/card';

export function gameReplay(data) {
    dispatch(data || GameReplayData);
}
export function updateUser(data) {
    dispatch(data || updateUserData);
}
export function gameStart(data) {
    dispatch(data || GameStartData);
}
export function gameHit(data) {
    dispatch(data || hitData);
}
export function gameTake(data) {
    dispatch(data || TakeData);
}
export function discardCards() {
    for (const key in CARD_MAP) {
        if (!CARD_MAP.hasOwnProperty(key)) {
            continue;
        }
        const game_ctrl = (window as any).game_ctrl as GameCtrl;
        game_ctrl.link.discard_zone_ctrl.discardCard(new CardModel(key));
    }
}
export function gameSteal(data) {
    dispatch(data || StealData);
}
export function gameAnnoy(data) {
    dispatch(data || AnnoyData);
}
export function gameBlind(data) {
    dispatch(data || BlindData);
}

export function testSeeTheFuture(data) {
    dispatch(data || SeeTheFutureData);
}

export function testAlterTheFuture(data) {
    dispatch(data || AlterTheFutureData);
}

export function billboard() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    // game_ctrl.link.bill_board_ctrl.updateInfo(
    //     { name: '3301', avatar: 'avatar' },
    //     { name: 'aaaaa', avatar: 'avatar' },
    //     '3401',
    //     1,
    // );
}

export function testUserExploding() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.onServerUserExploding(userExplodingData.res);
}

export function testGameOver() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.onServerGameOver(gameOverData.res);
}

function dispatch(data) {
    Sail.io.dispatch(data.cmd, data.res, data.code);
}
