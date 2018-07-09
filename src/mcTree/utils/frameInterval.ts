/**
 * 像interval一样的重复执行函数, 只是全部通过 requestanimationframe 来实现的
 */
export class FrameInterval {
    /**控制是否清除*/
    stop_interval = false;
    /**开始执行循环函数
     * fun 每次执行的执行的韩式
     * @param time 传入的间隔
     * @param space_time 间隔的时间间隔
     */
    start(fun, interval_time) {
        let then = Date.now();
        this.stop_interval = false;

        const interval = () => {
            if (this.stop_interval) {
                return;
            }

            let now = Date.now();
            let elapsed = now - then;

            if (elapsed <= interval_time) {
                return;
            }

            let time = Math.floor(elapsed / interval_time);
            then = now - (elapsed - time * interval_time);
            if (typeof fun == 'function') {
                fun(time);
            }
        };

        Laya.timer.loop(interval_time, this, interval);
    }
    stop() {
        this.stop_interval = true;
        Laya.timer.clearAll(this);
    }
}
