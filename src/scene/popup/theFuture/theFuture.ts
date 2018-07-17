import { PopupTheFutureUI } from './popup';
import { Observable } from 'rxjs';
// 1235

export type Type = 'alter' | 'peek';
export function seeTheFuture(type: Type, data) {
    return new Observable(observer => {
        const see_the_future = new PopupTheFutureUI();
        see_the_future.updateView(type, data, observer);
        Sail.director.popScene(see_the_future);
    });
}
