import { PopupTheFutureUI, Type } from './popup';
import { Observable } from 'rxjs';
// 1235

export function theFuture(type: Type, data): Observable<string[]> {
    return new Observable(observer => {
        const see_the_future = new PopupTheFutureUI();
        see_the_future.updateView(type, data, observer);
        Sail.director.popScene(see_the_future);
    });
}
