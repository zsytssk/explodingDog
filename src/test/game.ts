import { GameCtrl } from '../scene/game/main';
import { default as gameReplayData } from './serverData/gameReplay.json';
import { default as gameStartData } from './serverData/gameStart.json';
import { default as updateUserData } from './serverData/updateUser.json';
import { default as hitData } from './serverData/hit.json';
import { default as StealData } from './serverData/steal.json';

export function gameReplay() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.onServerGameReplay(gameReplayData.res);
}
export function updateUser() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.onServerUpdateUser(updateUserData.res);
}
export function gameStart() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.onServerGameStart(gameStartData.res, gameStartData.code);
}
export function gameHit() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.model.discardCard(hitData.res);
}
export function gameSteal() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.model.discardCard(StealData.res);
}

export function billboard() {
    const game_ctrl = (window as any).game_ctrl as GameCtrl;
    game_ctrl.link.bill_board_ctrl.updateInfo(
        { name: '3301', avatar: 'avatar' },
        { name: 'aaaaa', avatar: 'avatar' },
        '3401',
        1,
    );
}
