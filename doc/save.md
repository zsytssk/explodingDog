## 面向对象

-   面向对象的基本原则...

*   父类调用子类的方法, 在子类中不知道在方法哪调用的
    -   b extends a
    -   a --> init() --> initView()
    -   b --> initView()

-   @ques 继承 继承交叉 相互调用看的真的很混乱...

*   player 如何访问 game...

## other

-   @ques 能不能做成 pwa

*   尽量减少调用堆栈

*   @ques 如何测试..
    -   在浏览器中直接运行
    -   describe assert beforeAll beforeEach after...
    -   可以执行某个文件夹的所有测试 可以执行全部测试
    -   直接在 console 中输出结果...
    -   异步函数...
    -   api 简单明了
    -   coverage
    -   浏览器中直接展示 ui...

-   NodeCtrl 到底有没有必要存在...
    -   只是为了处理 弹出层 以及场景和弹出层的层级。。。
    *   所有子集的 view 都是自己创建的

*   每一个需要加载资源的 自己去设置自己的 loading 的样式。。。

*   emitToPrimus 这个做成 promise 好不好

    -   不太好 因为这不是一对一的

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
