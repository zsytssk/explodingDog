import { tweenProps } from '../mcTree/utils/animate';
import { log } from '../mcTree/utils/zutil';

export function testTween() {
    const callback = () => {
        log('complete');
    };
    const start_props = {
        x: 1,
    };
    const end_props = {
        x: 100,
    };
    const caller = {};
    const time = 5000;
    const step_fun = times => {
        log(caller, times);
    };
    tweenProps({
        callback,
        caller,
        end_props,
        start_props,
        step_fun,
        time,
    });
}
