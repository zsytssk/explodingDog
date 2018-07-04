import { default as gameReplayData } from './serverData/gameReplay.json';
import { default as gameStartData } from './serverData/gameStart.json';
import { default as updateUserData } from './serverData/updateUser.json';

export function gameReplay() {
    const game_ctrl = (window as any).game_ctrl;
    game_ctrl.gameReplay(gameReplayData.res);
}
export function updateUser() {
    const game_ctrl = (window as any).game_ctrl;
    game_ctrl.updateUser(updateUserData.res);
}
export function gameStart() {
    const game_ctrl = (window as any).game_ctrl;
    game_ctrl.gameStart(gameStartData.res);
}
