import { Observable } from 'rxjs';
import { PopupTheFutureUI, Type } from './popup';

export function theFuture(type: Type, data): Observable<string[]> {
    return new Observable(observer => {
        const see_the_future = new PopupTheFutureUI();
        see_the_future.updateView(type, data, observer);
        Sail.director.popScene(see_the_future);
    });
}

/** 关闭弹出层 */
export function closeTheFuture() {
    Sail.director.closeByName('the_future');
}