## 2018-07-25 11:15:49
* @todo slap 次数 + 倒计时

*

* @bug alarm bug

* @ques annoy blind 牌的样式..
    * 其他人也需要显示...

* @todo @imp gameModel reset 时 discard_list 需要清除...
    * discard_list

## 2018-07-23 10:09:07

-   @bug 出牌时 牌可能飞到屏幕的最上面

-   @bug 创建房间按钮点击效果

* @bug @测试
    * 【炸弹】玩家摸到炸弹之后,无法打出“剪断引线”卡牌
    * [炸弹狗]进入房间，牌面重叠，展示两次，图见附件

* @ques 要不要把game_ctrl 做成单例 好用来测试...

-   @ques @imp promise 的时候 destroy 了如何去处理

    -   animate tweenLoop + tween + countDown

    *   能不能先把这些动画全部停止了..
    *  如果中间一个tween 停止 对tweenLoop有没有影响
    * @ques promise 没有resolve 会导致性能问题吗
    * 如何让这动画 能方便的清除掉
    * promise 必须resolve reject
    * waitChoose observer race 的其他人要不要 清除...

* @ques waitChoose 的本质是玩家在几个人中选中一个人 而不是 许多人要被选中

-   @bug 出牌时 把原来的牌清除了

    -   要不要将所有打出的牌放到一起...
    -   discard_card 这个还要吗
    -   discard_card_list...



*   @todo actionManager

-   @ques annoy blind 的样式 动画效果

*   @todo 再来一局 reset

*   @todo 音效 产品

*   @ques the_the_future 点击查看牌
    -   选择卡组没有显示当前卡组

-   @todo 一个个小 ui 的出现动画

-   @ques 自适应复盘如何处理

    -   牌居中背景延伸

-   @ques 创建房间其他人要将 开始游戏置灰

    -   filter
    -   置灰按钮

-   @ques alarm [曾小平] 给所有人发 低于 12 秒我就显示
    -   出牌[自己出了洗牌]
    -   偷牌选人+给牌
    -   alter-the-future
    * 有没有可能 倒计时之后不需要继续倒计时

*   @ques 是当前用户创建的房间 这个数据在哪放在哪

    -   room_id create_user_id
    -   这些数据我只有在 hostZone 才需要
    -   我要其他用户置灰 hostZone

*   @ques curCardBox cardBox addCard addCards 大量重复代码

*   Sail socker 连接之后再发送命令...

*   @ques 倒计时退出房间报错...

-   @ques 初始化牌的时候牌的动画 加牌时牌的动画...

-   @opt 抓牌 动画抖动

-   @bug 出牌后 原出牌区的牌被清楚了

-   @note putCardBoxInWrap

-   @bug 创建房间

-   @bug 其他人没有看到 偷牌增加减少

*   @todo 炸弹 是移动牌 关闭之后 牌位置不对

*   @ques 其他用户的 give card, card_ctrl 如何销毁

-   @note

    -   用户爆炸了
    -   当前用户的表示
    -   偷牌选择玩家标志
    -   炸弹出牌

-   @ques tweenLoop 如果有一样的属性的就会奔溃

-   @note alarm 已经 show， 正在 show 这如何处理

    -   想要的效果是 不改变位置 但是功能正常

-   @note 出牌不好出

-   -   @bug 偷牌 + 倒计时 处理

*   @ques 用户的牌怎么不见了

-   @ques

-   @ques tweenFun caller 和 step_fun 的冲突
    -   参数太复杂了
    -   如果 start_props 是数字怎么处理
    *   要不要建立一个 step 函数去处理这些事情。。。

*   @note 要不要将 frameLoop 做成 Laya.timer 一样

*   Laya.timer.loop(interval_time, this, interval); 每次都需要去计算这个 是不是太耗费性能了
    -   每次添加 计算最小值 去改变 loop 的时间间隔
    -   每次清除也是这样， 如果为空就静止这个 interval
    -   最小的 timmer 如何去计算 所有 delay 的公约数
    *   const gcd = (x, y) => !y ? x : gcd(y, x % y);

-   @ques 章旸 billboard 是怎么做的。。。
-   @ques 属性渐变变化 + 每次变化的函数

## 2018-07-20 15:14:01

-   laya.components.Isbn 这是什么

*   broadcast 记录 querystring 和 Ctrl，只要找一次 外部触发 不直接调用 trigger

## 2018-07-18 16:27:08

1.  尽量将双方的观点表达出来
2.  就实际的事情去讨论, 免得陷入无谓的争论,
3.  有不一样也很正常, 谁负责的内容谁说的算
4.  如何还有不一样的地方, 可以每个人去实现自己的方案(在控制的时间内), 结果导向

-   @ques 操作台的展示

    -   @ques 有哪些展示

        -   出牌
        -   turn

    -   action 时如何去处理...

-   @imp player.status card_status 太重复了
    -   能不能牌 只要被选中的状态
    -   其他的通过 player 的属性来判断。。。
    -   这样应该可以

*   @ques 如何将事件 从 card 和 cardBox 中分离出来

-   @ques cardBox 牌的回弹动画时间缩小

*   @ques action 如果中间跳过， 我如何怎么将上一个的 complete
    -   如果 action 的流程

-   @todo 企业文化

-   @todo AcionManager 处理 action 每一步的切换

    -   提供初始化+更新的方法

-   @note curCardBox 在放到炸弹弹出层的时候 整个大小要改变 同时放回去要还原...

*   @ques 我有很多类 每一个类有很多方法 public private
    -   如何保持最少的 private
    *   CardBoxCtrl 基本上都是 public 方法。。
    *   开会整理下 每一个类

-   @bug 当前用户的牌

    -   移动牌牌经常飞出去
    -   toggleTip 牌时有问题

-   @ques 这一大堆 observer 没有清除会不会造成新能问题

*   @ques ts absctract optional

## 2018-07-10 10:33:55

-   @todo 选择玩家 + slap ... + self slap

*   @todo defuse 展示概率 剩余牌数

*   @ques 其他人的牌应该有边框 @设计

*   @bug 无法给牌

*   @ques CurCardBox 的移动 再 putCardBoxInWrap 之后怎么处理

-   @todo 牌飞行的 Box + CarBox 可以看到所有的牌

-   @ques 如果爆炸 爆炸的 action 没有后续操作...

-   @ques seeTheFuture 要不要复盘
    -   有些不需要显示的执行功能的牌但是复盘的时候需要显示这些牌
    -   。。。‘’
    *   这需不需要做回放的功能？？

*   @todo cardBox 中所有的当前用户的行为全部放到 curCardBox

-   @ques player 的 observer 没有必要记录只要传递就可以了
    -   seat 需要记录是自己的 就像 give_card_ctrl 一样

*   @ques import 循环引用

-   @ques 骨骼动画播放的位置...

*   @ques 能不能将代码重用 the_future + card cardBox cardModel
    -   渲染 滑动排序
    *   首先 the_future 中最精简的功能
    *   initUI

-   @todo 剪短引线 倒计时

-   @ques 弹出层关闭调用。。sail 的方法

    -   @ques 能不能看 popScene 有没有相同
        已经创建 的...

-   @ques action_info 要放在 player 还是 seat 上面

    -   @ques 放在哪个上面更合理
    -   放在哪个上面 更简单

-   @ques action 导致的 billboard 信息展示在什么地方抛出去
    -   action --> card
    *   这个和 action 本身地 作用是分离的这样 显的很乱？？

*   @ques 和章旸目前最大的意见冲突是什么
    -   action 要不要放在 card 上面

-   @ques 当前用户不展示其他用户的的选择用户的样式

    -   beAction 需要哪些 data

-   @ques 是先 super destroy 还是自己 destroy

*   @ques 我怎么区分在其他用户的牌有没有打出...

-   @ques 我怎么知道那张牌是被给的呢？？？

    -   设置属性???

    *   和 discard 的冲突？？？

*   @ques 牌的 action 这个是复杂 别人 不一定看得懂？？

    -   怎么变得简单， 最简单是什么样子的

*   @ques 复盘是不是需要特殊处理...

-   @ques 偷牌：：给牌要不要等到狗手消失 再去添加牌

-   @ques 出千 alter_the_future 这些通过什么去掉更合适

*   @ques promise 只能一次 如果服务器出错了 我就没办法继续了...

*   action 需要 status act complete 这个属性吗
*   @ques player action_info 能不能用 status 来代替

-   @ques 除了选择用户， 其他的 action 都只有当前用户才需要执行

-   @ques 如何在服务器返回成功的时候才将 give_card_ctrl hide

*   @ques tslint ignore folder

-   @todo 猫手动画 整理下

*   @ques 怎么判断是正常出牌还是给牌给其他人...

-   @ques 动作的操作人也需要创给 action

*   @ques load 怎么很长时间才消失...

-   @ques giveCard 这个应该等到服务器返回时候 才把牌放到狗的手里
    -   这也应该在 cardBox 中执行
    -   收到服务器 --> Action --> playerA Card to PlayerB --> Seat --> cardBox
    -   牌放到狗手里 狗都一下 牌飞到用户手里 变成隐形
    *   其他用户只显示牌增加的动画...
    *   如果失败牌直接飞回用户的手里 像出牌一样...
    *   感觉这有点复杂..
    *   ...
    *   狗手直接消失 其他用户增加一张牌...
    *   ...
    *   @ques 给牌的命令在哪里发

*   @ques 曾小平 其他用户的牌已经出了我怎么处理
    -   我怎么知道 他牌已经出了呢 都是 ‘\*’

-   CardData 要不要就删除了

*   @ques 曾小平

    -   gameReplay hitData hitUserId 能不能换成 userId 和 hit 一样

*   @ques 为什么我监听两个 player_cmd.status_change 就会死机呢

-   @ques 这有一个问题
    1.  seat 上面 action_info 什么时候清除【complete】
    2.  如果同时有多个 action 作用在用户身上那么 这就不行了
        ...

*   @ques 每一个 action_act 是作用改变每一个人的属性 还是直接绑定 action
    -   哪一个更合理 哪一个更方便
    *   似乎直接使用 action 更方便 不需要额外再去定义一些属性了..

-   @ques 只有当前用户的 card 才会去监听 action_send

*   @ques 能不能把 docker 。。。全部放在 widget 文件夹 ui + ts

-   @ques 如果 promise es5 支持有问题 那我就跪了

*   @note 小功能区域 WidgetWrap

-   @ques 发给服务器 hit 里面做怎么是 hitParams

*   @ques 能不能将动作全部设置为动作...

    -   action 的名称要说明他的意义

*   @ques action 的类型
    -   发给服务器 actionSend
    -   act actionAct
    *   act complete

-   @ques 将 promise Resolve 放在 playerModel 上 等待 ctrl 去执行
    -   有没有更好的方法

*   @ques 为什么 要无 null

-   @ques 有些命令不是当前用户不去执行 这怎么处理

    -   选着用户。。。 自己选择别人 操作者是自己...

    *   给牌 只有自己给牌给别人
    *   比方说其他用户 targetChooseId， 我根本就不需要展示...
    *   但是别人给了牌我要加进去

-   @ques 这 action 能使用不同的命令有点乱 能不能使用统一的 action 命令呢？？

*   @ques 新建的 promise resolve 没有执行会不会导致 无法删除 内存泄漏的 bug 【google】

*   PartialAll<T, U, ...> 这后面能不能是任意多个数

-   @ques 牌属于一个人 或者 discard_card 这如何处理
    -   在玩家手上出去去
    -   复盘的时候如何设置
    *   owner player 两个处理太麻纺了

*   不需要 stealCard 这个类了
    -   只需要根据 cardId 找 action 就可以了;

-   @note 偷牌 选择一个人 如果选择一个人 那么就返回...

*   ActionCtrl

-   action --> cardm --> cardctrl --> seaTheFuture

-   @note 用来判断 一张牌 有没有出去
    1.  准备出牌可以在 game 设置一个属性。。。记录准备出的牌
    2.  game discard_card 还能不能设置属性...

*   @ques choose 选择目标 选择成功之后 消除 却在另外一个命令里面这有问题

-   @ques 所有关于牌的动画需要在一个地方统一处理

-   @ques

*   @ques 致盲时 干扰的牌的样式...

-   action active
    -   作用 反馈

*   @ques chooseTarget waitTarget 是不是应该属于一个动作

*   @ques 激活到结束

-   steal
    -   判断 step 只有第一次是出去去..
    -   多定义几个
    -   step ！= 1 找到
    *   step 每一个 step 命令不一样 找用户 显示箭头.
    *   ..

*   actions --> chooseTarget --> owner + target_list -->

*   @ques chooseTarget 由 game 去选择一个目标这个想法其实不错；

-   game 包括

-   @ques 有那些牌可能需要特殊的处理
    -   exploding 3001
    *   steal 3401
    *   see_the_future 3501
    *   shuffle 3701
    *   anooy 3901
    *   blind 4001
    *   fake_shuffle 4401

*   @ques steal 的状态变化

    -   step_list

    *   active
    *   chooseTarget
    *   waitTarget
    *   getCard
    *   end

*   @ques 牌已经打出 但是还是属于用户 用户可以接着操作...

    -   active 开始激活

    *   setStep ....

    -   end 失去作用

*   @note shuffle fake_shuffle 需要洗牌的声音

    -   这个在牌打出的地方去处理
    -   discard_zone

*   @note blind player status + blind
*   @note steal player status + need_give_card
*   @note anooy card is_freeze:> freeze unFreeze | setStatus

*   @ques 只有在自己能拿牌的时候才发送命令给服务器...
    -   cardHeap 怎么知道 当前用户是否是可以抓牌
    -   由 player 发送。。

-   @todo 设置炸弹概率

*   @note 玩家的牌飞行时间函数 先快后慢

-   @todo 炸弹自动打出 但是还在牌堆里面

*   @imp 拖出牌 重新整理 还是有问题..

*   @note tween 对象属性变化
    -   变化间隔..

-   @ques 其他玩家的牌没有居中

-   @ques 其他玩家 gameStart 牌没有更新

*   @ques 当前用户的牌堆要比其他的一切都高

*   @ques 其他玩家的出牌动画

    -   要不要所有的牌全部用一个类

-   @todo 当前用户牌放到 出牌区 就清除所有的事件绑定

*   @ques

-   @bug tween 不支持 rotation
    -   tween loop 有时候不灵 is_stop, 有问题

*   @note tween 直接使用 Laya.Ease.BackIn 怎么样

*   @ques 当前用户的 seat_id

    -   @ques 其他用户的信息在当前用户的前面，
    -   每次你去判断当前用户的座位 id

    *   这个我如何处理
    *   setTimeOut....

    -   这是要放在 model 还是 ctrl 里面去执行。。。

*   @bug 自己拍拖动 可能会飞出去

-   @todo game_type_map

-   @ques discardCard 当前用户 非当前用户 判断 有没有必要抽成两个 class

*   @ques 出牌失败 返回牌堆...

-   @ques 其他用户出牌 我怎么知道出了那一张牌

-   @ques 如果是 borrow 从背面到正面展示
    -   我如何去控制大小
    -   其他玩家本来都没有逼的牌 我如何控制显示牌面...

*   card box borrow card to discard zone

-   郑铭 保卫萝卜的源码再发给我。。

-                                                                                                                                                                                                                                                                                                                                 @note hit 服务器返回错误 要将牌再放到牌堆里面

*   @ques ts 测试 private

-   @ques 复盘的时候会有

-   discardZone card 和当前用户的牌 有很多相似的代码 能不能公用 initUI 方法公用

-   @ques sail 能

*   @ques 所有的事件 的方法处理加上 On 应该会 更清晰...

-   @ques card 在销毁的时候的处理。。
    -   card discard 的时候 model 并没有被销毁 但是 ctrl 需要销毁...

*   @note 马一帆 import 比方说 primus socket http

-   @note card unSelect 需要根据 card 的位置将他插入到不同的位置

*   @ques 在什么地方判断是否出牌

-   @bug 有时候 牌 拖动的时候 鼠标不再牌上

*   @note 其他玩家的牌是居中对 齐的。。

*   @ques CurCardBox 里面一大堆乱的属性 控制移动 很乱

*   @ques 如果在 CurCard selecte 的时候 destroy
    -   不要因为 view 加到 stage 而忘记删除

-   @note 和章旸组织 code review()
    _ 现在怎么写 怎么想
    _ 对方什么意见 \* 吐槽交流会。。。

*   @note sortCard 的动画

-   @note 选中一次就无法再被选中了。。。

*   @ques 出牌 的动作包括哪些内容。。

    -   划出的位置 牌堆重新整理
    -   等待处理 能出牌 出牌 不能出牌 牌重新进入牌堆

*   @ques 划出去的牌我怎么去 放在什么地方

    -   cardBox.selected_card

*   @ques 划到什么位置 触发牌的重新整理
    -   向上划出一定的位置触发 触发之后直接跳出牌堆
        -   @ques 跳出多高？？
            -   一半 且发光
    *   选中的牌 在所有的牌的上面

-   @note 牌的排列是一上一下牌一上一下

-   @note 出牌区域先显示 突出这个区域

-   @note 牌堆里的牌划到我的牌堆里面一定的区域才算 出牌

-   @ques cardBox 整体滑动如何处理

    -   @ques 是整体居中的吗
    -   @ques 最多不能 有空白区域
        -   @ques 查看牌的样式是例外 那张牌居中显示
        -   返回之后 如果再次滑 动需要重新整理。。。

-   Game -->

    -   Seat --> CardBox --> Card
    -   discardZone

    *   CardCtrl --> CardModel --> player --> GameModel.discard_card
        -   --> discard_zone

*   @ques CurCard 中引用 CurCardBox 用 parent 来做这个处理
    -   有没有更好的方法。。。
    *   我这还要用到 discardZone...

-   @ques 出牌的逻辑是什么

    -   CardCtrl --> CardModel --> Game::discardCard --> discardZoneCtrl --> 等待服务器返回
        -   成功 就这样...
        -   失败 将牌还原到牌堆
    -   @ques 在什么地方去发送命令给服务器

-   @ques 不知道子类的方法在哪调用

## 2018-07-06 10:16:50

-   @ques 怎么处理有些牌的类型需要显示 count 有些需要这个功能却不显示
    -   这些数据的格式 都不一样 要不我都显示成一样的

```js
'3501': {
    count: '1',
    type: 'sea_the_guture',
    name: 'see_the_future',
    show_count: false
},
```

-   @ques 减少一张牌 如何去处理

*   @todo 牌的基本操作

    -   展示牌
    -   牌的增加 + 减少。。。

    *   拖牌到出牌区域
    *   抓牌

*   @ques player 初始化的时候 CardModel 已经创建
    -   在这之后 Seat 才去监听 Player 的事件
    -   。。

-   @ques billboard 开始后的位置？

*   seat --> card_box
    -   CurCardBoxCtrl createCardBox:CurCardBoxCtrl
    -   CardBoxCtrl createCardBox

-   PlayerModel --> SeatCtrl -->
    CurSeatCtrl --> CurCardBox
    OtherSeatCtrl --> OtherCardBox

*   @ques remain time 放在 model 怎么样
    -   增加我的复杂度 没有必要

-   event 经常有重名的地方 能不能用 cmd，

*   @ques 当前用户的手牌信息处理

    -   需要知道用户是否是当前用户。。

    *   我现在在 gameCtrl 里面记录 cur_seat_index cur_user_id 来处理。。。
    *   怎么判断用户是否是当前用户

*   @ques 怎么判断 Model 是否是当前用户

    -   在填充数据的时候直接把修改原始数据。。

    *   调用外面的函数。。。isCurUser

*   @note 当前玩家的牌的处理

    -   整理滑动
    -   选中某张牌
    -   从牌池抽出一张牌
    -   选中某张牌给外面玩家。。。

-   @note 交流难点
    -   cardBox 测操作。。

*   @ques js 有什么办法可以登 录 ssh

-   @note
    git subtree add --prefix=src/mcTree git@git.coding.net:zsydev/mcTree.git master --squash
    git subtree pull --prefix=src/mcTree git@git.coding.net:zsydev/mcTree.git master --squash
    git subtree push --prefix=src/mcTree git@git.coding.net:zsydev/mcTree.git master

*   @todo 整理 麻将中的代码

-   subtree 如何删除 如何提交到远程。。。

-   @ques 能不能 mc 能不能使用 gitsubmodule

*   @ques card 的 view 在自己的 ctrl， 还是在父类的 ctrl 中添加

*   ctrl 基本上都有 view， 在销毁的的时候都要处理 有没有必要放在 BaseCtrl 中

-   io 出现错误的时候要不要统一处理。。

*   @note 牌的大小 [231x246]

-   @ques 类型“Observable<{}>”上不存在属性“retry”。
    -   axios

*   @ques 在每一个命令里面加 is_ready 判断十分的麻烦
    -   我原来
    *   基础类 继承 baseCtrl 里面绑定 primus 的方法。。。
    *   。。。

-   监听服务器的命令和 model 的命令这两者容易重名如何处理

    -   onModel
    -   onPrimus 这名字也太长了吧

-   @ques loadAssets 的 then 为什么在 load_util 的前面
    -   console 中 怎么还有图片没有显示。。。、
    *   @ques 马一帆

## 2018-06-29 10:25:00

-   @ques js getKeyFromValue

-   @ques CardType 我保存时 normal 服务器是 0 1 这些
    -   这两个相互转化实在麻烦 如何合理

*   @ques roomInfo 的设置

    -   gameModel 的多个属性关联。。。

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

*   mcTree [框架名称]

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

-   父类抽象方法

-   继承常出现的问题 以及解决办法

-   @todo 使用异步函数

## 2018-05-24 11:19:23

-   card skill action..

-   前端技术评审 萌哥 铭哥...

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

*   列举所有可能的相互引用类型...
    -   相互调用的类型有哪些...

## 2018-05-15 14:44:54

-   @ques 数字键盘能不能用系统自带的[不能]

    -   自适应无法处理

-   @ques 引线燃烧动画, 长度变化

*   @ques html5 能不能调用手机振动

-   如何添加测试代码
    -   要测试什么??

*   鸟类卡牌游戏
    -   ...
