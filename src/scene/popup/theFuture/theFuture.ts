import { Observable } from 'rxjs';
import { PopupTheFutureUI, Type } from './popup';

export function theFuture(type: Type, data, remainTime): Observable<string[]> {
    return new Observable(observer => {
        const see_future = new PopupTheFutureUI();
        see_future.updateView(type, data, observer);
        Sail.director.popScene(see_future);
        Laya.timer.once(remainTime - 500, this, () => {
            closeTheFuture();
        });
    });
}

/** 关闭弹出层 */
export function closeTheFuture() {
    Sail.director.closeByName('the_future');
}
