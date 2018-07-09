## Timeout

```ts
/**
    * 创建setTimeout, destroy时自动清除
    * @param fun 执行函数
    * @param time 延迟时间
    */
protected createTimeout(fun: FuncVoid, time: number) {
    const time_out = window.setTimeout(() => {
        callFunc(fun);
        this.clearTimeout(time_out);
    }, time);
    this.timeout_list.push(time_out);
    return time_out;
}
/**
    * 创建setInterval
    * @param fun 执行函数
    * @param time 时间间隔
    */
protected createInterval(fun: FuncVoid, time: number) {
    const interval = setInterval(fun, time);
    this.interval_list.push(interval);
    return interval;
}
/** 清除time_out setinterval */
protected clearTimeout(time_out) {
    const timeout_list = this.timeout_list;
    const interval_list = this.interval_list;

    let index = timeout_list.indexOf(time_out);
    if (index !== -1) {
        timeout_list.splice(index, 1);
        return;
    }

    index = interval_list.indexOf(time_out);
    if (index !== -1) {
        interval_list.splice(index, 1);
        return;
    }
}
/** 清除time_out setinterval */
protected clearAllTimeout() {
    const timeout_list = this.timeout_list;
    const interval_list = this.interval_list;
    for (const item of timeout_list) {
        clearTimeout(item);
    }
    for (const item of interval_list) {
        clearInterval(item);
    }
    this.timeout_list = [];
    this.interval_list = [];
}
```
