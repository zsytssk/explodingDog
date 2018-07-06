## 2018-07-06 10:16:50

-   @note 牌的大小 [231x246]

*   @ques 类型“Observable<{}>”上不存在属性“retry”。
    -   axios

-   @ques 在每一个命令里面加 is_ready 判断十分的麻烦
    -   我原来

*   监听服务器的命令和 model 的命令这两者容易重名如何处理
    -   onModel
    -   onPrimus 这名字也太长了吧

## 2018-06-29 10:25:00

-   @ques js getKeyFromValue

-   @ques CardType 我保存时 normal 服务器是 0 1 这些
    -   这两个相互转化实在麻烦 如何合理

*   @ques room_id 在什么地方设置 ll

    -   只有真正进入游开始有这个属性...
    -   能不能加一个命令...
    -   enterRoom... 有 roomInfo

    *   setRoomInfo

*   scale_in scale_out slide_left_out
    -   rotate 有时候没有作用
    -   怎么有时候有作用 有时候没有作用

-   @todo 显示房间号
    -   显示卡组修改

*   @todo animate to promise

-   @qeus tweenLine 能设置属性成为一个数组吗

*   mac window 共享

*   @ques wasm -- js 两者沟通的代价...

    -   过去再回来只需要> 1.3ms, 太快了.., 0.ms

    *   直接 return 很慢..., 再那边再调用这个方比较快
    *   传递数组过去...
    *   我觉得所有的方法都应该返回一个 promise...
    *   可能越复杂的对象就越慢...

*   @ques 当前用户在为加入房间中要显示的特殊处理
    -   这添加一大堆乱的代码

-   window.test = module.exports;

    -   typescript get all export

-   @note CountInfo 需要整理下

-   能不能把我的弹出层做的像小马哥的一样
    -   需要的时候才去创建...

*   @todo ts laya 项目

*   @ques typescript item of array

-   @note 同一个数据 model 和 ctrl 分离两个人来做
    -   偷牌

*   @ques gameReplay

-   @qeus 牌的信息是什么样子的

-   @ques console.log 要不要用 sail 的

*   @ques 怎么判断用户是不是房主 @zengxiaoping

*   @ques model;> add_player 再去创建 ctrl
    -   可以吗 ?
    -   是不是更好...

-   @ques 章旸分工
    -   房间里面的逻辑是我管的, 按照我的规则
    *   不要动的我的 model..
    *   有意见尽管提...

*   @note 查找未使用的资源

-   @todo

    -   快速匹配
        -   玩家加入
        *   倒计时开始游戏

    *   创建房间 等待用户加入 游戏开始...
        -   选择房卡 + 开始游戏 房主和其他玩家的控制..
        *   游戏未开始...
    *   ---
    *   @ques 服务器的 api 有没有这个数据

*   mcTmpl [框架名称]

-   @ques model ctrl 这所有的一切都应该放在一个文件夹下面
    -   属于一个命名空间内...
    -   不 import 就不使用...
    -   独立的功能...

*   @ques 游戏的命令在 game_replay 之前收到如何处理
    -   ...
    -   能不能再 gameReplay 中再去注册其他的绑定
    *   这因该是最好的方法..

-   @ques 如何将游戏的逻辑清晰的表示出来

    -   interface 然后实现 interface

-   @ques 更新用户数目

-   sail.io 只支持一个绑定 这个和我原来的 primus 如何处理

    -   我原来的 primus 是如何可以注册多个事件的

-   @ques loadUtil 需要依赖 ResMap..
    -   这两者应该相互独立的
    -   load 要踢除特定的资源格式...
    -   减少依赖

*   @ques 小马哥 Laya.URL.version 如何设置的

-   @ques 下面的代码是做什么的

```js
Laya.SoundManager.setMusicVolume(0.4);
Laya.SoundManager.autoStopMusic = true;
```

-   @ques 如何区分是不是有很多的区别
    -   game_type 你

*   @ques box 返回 怎么显示原来的 box

-   @todo
    -   loading []
    -

*   @todo
    -   选择卡组界面 chooseCardGroup

-   @todo 加入房间
    -   @ques 房间那么多的状态如何去组织
        -   @init --> start --> ... 状态变化

*   出牌区 需要一张底图

## 2018-06-11 11:07:31

-   sourcetree portable

-   @note 卡牌怎么是方的, 是不是应该是长的

-   @ques aniFactory 可以做成 扔函数进来

*   @ques 如何用 render 来传递 view 渲染

-   父类的 ctrl 的 view 有子类不是属于 ctrl 如何处理
    -   强制将所有的 view 节点都用 ctrl 包裹...
    -   这样是不是太恶心了

*   @todo 无 ui ctrl 传递子类的 view 给自己的父类..

-   crypto-js webpack 报错
    -   Module build failed: Error: Debug Failure. False expression.
    *   不知道是 webpack ts | crypto 哪一个的 bug

*   @todo 超级射手 bug

-   sendCacheDataToServer 这个怎么处理

    -   ... 在服务器还没有连接的时候发送的命令

-   @ques primus 中一大堆项目的代码能不能抽离出来
    -   他应该是一个独立于项目的模块..

*   @ques primus heartBeat 如何处理..

-   @ques router 能不能跳过中间直接到达自己的目的地
    -   '' -> default -> hall

*   @ques zsy.director 如何做成 storage 的样式

*   @ques 能不能将 director 做成(name:\path\to\your\page)

    -   那么这个地址就属于类型为 name 的下面

    *   默认的为 default 地址...

*   @ques 什么样的函数放在 zutil 中 什么放在 tool 中..
    -   zutil 关于找节点 转化 dom..

-   @ques RouterOutsetCtrl 能不能做成 不需要 ui 添加

    -   同时 router 的配置也放在这里

-   @ques router config 能不能做成最简单的形式
    -   能不能不增加 load...

*   @qeus RouterConfigNode 哪些接口可以做成 private

*   @参考 react 的接口...
    -   @ques 能不能把我的 ctrl 不仅支持 ctrl 而且支持 function...
    *   最终能像 react-jsx 一样的组织自己的 ui..
    *   我感觉自己的 ctrl 太复杂了,

-   @ques 自定义 loading 的样式如何处理
    -   最好能像 react 的 loadable 一样
    *   有一个 ctrl 包裹器 hallLoad, 控制他自己的子类 hall
    *   如 hall 资源没有加载, 就加载 load, 加载完成之后再把自己的子类换成 hall...

*   @ques 要不要将 app 中的 component 移出来

-   拿来就可以用的 webpack ts ...

*   @ques load 的模块不应该依赖 Res, 但是
    -   load 却需要 res 的格式
    *   res 格式在 load 里面确定

-   @ques 切换其他场景
    -   将其他场景的 resolve 取消如何处理

*   load loadui + loadfunc

-   initView 到底要在什么时候初始化 这牵扯到所有的和节点绑定的 ctrl..
    -   loadRes

*   emitToPrimus 这个做成 promise 好不好
    -   不太好 因为这不是一对一的

-   adjacent-overload-signatures

*   onModel 这个绑定在 baseCtrl 合不合适 有什么作用

-   所有类型全部用首字幕缩写

*   所有 NodeCtrl 界面有没有初始化

    -   inited_view;

*   router 发生改变 关闭所有弹出层应该放在 app 中
    -   弹出层跟着 页面走, 就不需要这个处理了

```ts
let router = this.link.router;
/** 页面变化所有弹出层全部关闭  */
this.bindOtherEvent(router, CMD.router_change, () => {
    if (this.status == 'showing' || this.status == 'shown') {
        this.hide();
    }
});
```

-   NodeCtrl 的作用
    -   view_class new..
        -   addChildView 添加到父类的 view 中
        *   show hide
    *   设置 view 的 zOrder
    *   destroy
    *   render
    *   ---
    *   实际的使用的处理..

*   prettier format jsdoc

*   管理器

```ts
/** 添加资源 */
    protected loadRes(callback: Function) {
        let app_ctrl = queryClosest(<NodeCtrl>this, 'name:app') as AppCtrl;
        let load_ctrl = app_ctrl.link.load_ctrl;
        load_ctrl.load(this, callback);
    }
    /** 获得节点对应资源的状态 */
    get resource_status() {
        let name = this.name;
        let result = null;
        for (let i = 0; i < RESMAP.length; i++) {
            if (RESMAP[i].name == name) {
                return RESMAP[i].resource_status as t_resource_status;
            }
        }
        return result;
    }
    /** 设置节点对应资源的状态 */
    set resource_status(status: t_resource_status) {
        let name = this.name;
        let result = null;
        for (let i = 0; i < RESMAP.length; i++) {
            if (RESMAP[i].name == name) {
                RESMAP[i].resource_status = status;
            }
        }
    }
```

-   setBackgroudMonitorStatus 放在本身的 CTRL 中

*   @ques hall 如何去处理...

*   @todo 页面的基本框架 +问题总结

    -   @ques 路由切换
    -   @ques 弹出层逻辑
    -   @ques nodeCtrl
    -   @ques load 逻辑

*   @note broadcast report 找其他的 ctrl 可以缓存

-   @note 所有的事件按照模块划分 分在不同的模块中...
    -   弹出层也一样 提供哪些时间才可以用哪些时间

## 2018-06-11 11:02:57

-   这框架一个个整理太麻烦了
    -   如果能直接有一个初始模板就好了...
    -   自己的框架 github

## 2018-06-08 09:22:42

-   debugType2 改名

*   @ques prettier 如何 格式化注释

-   对所有的 broadcast, report... 进行缓存
    -   避免每次查找性能问题。。。

*   @ques 如何测试..
    -   在浏览器中直接运行
    -   describe assert beforeAll beforeEach after...
    -   可以执行某个文件夹的所有测试 可以执行全部测试
    -   直接在 console 中输出结果...
    -   异步函数...
    -   api 简单明了
    -   coverage
    -   浏览器中直接展示 ui...

-   弹出层的接口..

-   @ques 能不能尽量降低代码中的相互依赖
    -   这样测试只需要一个个的测试就可以了
    *   ...
    *   常见的几种情形如何降低
        -   监听其他 class 抛出的事件
        -   调用其他 class 的函数..
        *   ...

## 2018-05-31 09:55:58

-   这个 promise 能不能使用...

*   @ques promise 开发不用生产要 es5 这个如何处理...

-   @ques 能不能将 js 中 libs 放在 src 中每次自动编译复制文件过去...
    -   我怎么知道哪些 js 文件没有被 import
    -   所有 libs 中的文件都是需要外部引用的
    -   fileloader...
    *   先不用处理...

*   @note git remote 放在哪里 怎么处理
    -   ...

-   @ques 直接使用 ts 项目怎么样?

    -   需要再次编译才能使用 ui
        -   能不能用 webpack 自动去编译 ui...
    -   需要使用 laya 自己的 tsconfig, 可能对放在其中的 js 存在问题

        -   这并不算是问题

        *   webpack copy 文件

-   zutil
-   错误处理
-   路由
-   load
    -   资源加载
-   弹出层

*   @捕鱼...

-   @qeus window 下面变量如何处理

-   @ques

    -   JSEncrypt Primus type 在哪里 copy
    -   ..

-   @todo 设置 userId..

    -   放在 test 中..

-   @note 技能 action...

*   参考麻将项目有哪些优化的地方
    -   http
    -   axios
    -   ..
    -
    *   测试代码
    *   ...

-   @麻将 | @炸弹狗 | ...

-   多个对象很乱 @张俊清 如何处理这问题

-   @ques 如何 参与进来 章旸 姜云毅
    -   如表达自己的看法
    -   如何提高相互的了解

*   切换场景不改变 url

-   @todo 面向对象的基本要求...

-   @todo tslint 未使用变量

-   @todo test

-   @note 能不能拿白鹭做一个 demo 看看...

## 2018-05-25 10:02:51

card
{
card: 'steal',
status: 'start' | 'chooseTarget' | 'waitTarget' | 'end'
target: 'userId'
}

-   捕鱼中堕胎 class 传过来传过去十分的麻烦

-   全面 promise

*   所有资源的配置...

    -   原来放在 sprite 中的再通过 js 组织代码
    -   有没有更好的方法

*   郑铭 创建鱼的动画...

*   父类调用子类的方法, 在子类中不知道在哪调用的
    -   a --> init() --> initView()
    -   b --> initView()
*   父类抽象方法

*   继承常出现的问题 以及解决办法

*   @todo 使用异步函数

*   @ques 继承 相互调用看的真的很混乱...

## 2018-05-24 11:19:23

-   card skill action..

-   ctrl 参考 react

    -   生命周期

-   前端技术评审 萌哥 铭哥...

-   原有 ctrl 的问题
    -   父类调用子类的方法 如何处理
    -   继承交叉

## 2018-05-22 17:06:19

-   技术评审
    -   专门讨论 重要的部分
    *   技术评审 前端要不要 去说说...
    -   ...

*   @ques 技术 评审 萌哥要不参加

*   @ques 章旸有没有兴趣参加

*   @ques 牌的技能

    -   status: start | findTarget | waitTargetRes | end
    -   target: userId | seatId
    -   每一张牌的技能不一样 status 也不一样

*   @note 偷牌技能

    -   start | findTarget | waitTargetRes | end

*   @ques 禁用牌

    -   start | | findTarget | waitTargetRes | selectCard | end

    -   技能 target 对象的属性变化...

*   @ques 偷看牌 \*

    -   start | actived | end

-   @ques 所有的牌 每一个可能导致技能的变化...

-   @note

*   想法 实现思路 具体做法
    -   一个达到的目标
    -   如何去实现
    -   实际中的做法

-   所有工作内容...
    -   ...
    -   新手引导...
    -   技能的逻辑

## 2018-05-19 10:04:22

-   @每一个对象使用他自己的配置...

-   团队合作 增加工作效率

-   ctrl 参考 react
    能不能参考 react render 来做我的 ctrl 异步可以应用 load 逻辑，同时可以把子节点做成异步，我每次进入页面都需要，同步创建一大堆类 这样 就是一个非常大的堆栈 会导致明显的卡顿，如果能做成异步，那就不会这样 这样有一个问题 我没有办法在子元素创建的时候知道他的子元素

    -   ***
    -   这是不是把事情 搞复杂了
    -   ***
    -   将 ui 的渲染从 ctrl 初始化中独立出来, 放在 start 上面
    -   顶级元素 init 然后到每一个子集元素 init, 所有的子集元素全部 init 成功之后, 顶级元素开始 onLoad... 结束之后
    -   再 start... 引入生命周期, 但是像 react 类似的 api

-   尽量减少调用堆栈

-   ctrl 生命周期

-   列举所有可能的相互引用类型...
    -   相互调用的类型有哪些...

## 2018-05-15 14:44:54

-   @ques 数字键盘能不能用系统自带的[不能]

    -   自适应无法处理

-   @ques 引线燃烧动画, 长度变化

*   @ques html5 能不能调用手机振动

-   能不能做成 pwa

*   如何添加测试代码
    -   要测试什么??

-   鸟类卡牌游戏
    -   ...
