v1.1.4
core：
[dialog]
1.新增`closeByGroup`和`closeByName`选项，默认为false。设置为true时，在dialog的为多弹窗模式的时候，弹出弹窗的时候会关闭同一个group的所有弹窗，或者同一个name的第一个弹窗。
    示例：
    ```js
        class Alert extends Laya.Dialog {
            constructor () {
                super();

                this.group = "test_group";
                this.CONFIG = {
                    "closeByGroup" : true
                }
            }
        }
    ```
[io]
1.在游戏隐藏的时候恢复接收io事件
2.在接收到没有cmd的命令的时候会把cmd设置为`no_cmd`

tools:
[notify]
1.修复同时实例化多个notify实例的时候，公告内容会错乱的问题。
2.新增公共默认垂直对齐方式为`top`;
3.添加的内容为`null`或者`undefined`的时候不再调用`complete`回调函数

[error]
删除Sail库中的error模块，error模块使用方式不变，可以单独放在项目目录中。



v1.1.3
core：
[dialog]
1.修复在某些情况下弹窗内部的`onOpened`和`onClosed`的this指向为undefined的bug
  bug示例：
  ```js
  class TestDialog extends Laya.Dialog {
      constructor () {
          super();
      }

      onOpened () {
          console.log("TestDialog onOpened.", this);
      }
  }
  Sail.class(TestDialog, "Alert.Test");

  let config = {
      autoClose : 3000,
      onOpened (_super) {
          _super();
          console.log("TestDialog onOpened 2.");
      }
  };
  Sail.director.popScene(new Alert.Test, config);
  ```
  此时弹窗内部的onOpened的this为undefined;
  会输出:
  `TestDialog onOpened.undefined`
  `TestDialog onOpened 2.`

v1.1.2
tool:
[notify]
1.在调用`notify.add(data);`方法时，如果传入的data为`[]`空数组时，不再触发complete回调函数


v1.1.1
core:
[utils]
1.新增formatTime函数，用户将毫秒转换为`{h}小时{m}分钟{s}秒`的格式
2.修复不支持es6的环境下，Sail.Utils.js的formatTime函数会报错


v1.1.0
core：
[director]
1.游戏显示、隐藏时会发布`stage.visible`事件，`true`为显示，`false`为隐藏

[dialog]
1.修复关闭弹窗时立即弹出另一个弹窗会把第二个弹窗隐藏的问题
2.修复非模式窗体弹出时，事件不能穿透的问题
3.弹窗配置支持小写，例如 this.config = {};
4.支持在外部调用`onOpened`和`onClosed`时，同时执行弹窗内部的`onOpened`和`onClosed`
  示例：
  ```js
  class TestDialog extends Laya.Dialog {
      constructor () {
          super();
      }

      onOpened () {
          console.log("TestDialog onOpened.");
      }
  }
  Sail.class(TestDialog, "Alert.Test");
  ```
  调用示例：
  ```js
  let config = {
      autoClose : 3000,
      onOpened (_super) {
          _super();
          console.log("TestDialog onOpened 2.");
      }
  };
  Sail.director.popScene(new Alert.Test, config);
  ```
  此时会输出：
  TestDialog onOpened.
  TestDialog onOpened 2.

[io]
1.修改ajax返回数据，ajax异常时不再返回xhr.error
  示例：
  ```js
  "/act=test" (data, code) {
      if(code === "success") {
          //ajax正常返回数据，data为返回的数据
      }else{
          //ajax异常，data为异常信息
      }
  }
  ```
2.更改io数据为异步模式，否则在游戏切换到后台暂停时容易卡死
3.在游戏隐藏的时候不再接收io事件

[scene]
1.修复切换场景时上一个场景没有销毁的问题
2.新增在触发stage的resize事件时，默认修改当前场景的宽高为stage的宽高

tool:
[keyboard]
1.在调用数字键盘时增加作用域选项
  示例：
  ```js
  let config = {
      caller : this, //this为当前模块
      input (value) {
          this.amount.text = value;//此时this为当前模块
      },
      close (type, value) {
          if(type === "confirm"){
              this.amount.text = value;//此时this为当前模块
          }
      }
  }
  Sail.keyboard.enter(this.amount.text, config);
  ```
  等价于
  ```js
  let config = {
      input : function (value) {
          this.amount.text = value;//此时this为当前模块
      }.bind(this),
      close : function (type, value) {
          if(type === "confirm"){
              this.amount.text = value;//此时this为当前模块
          }
      }.bind(this)
  }
  Sail.keyboard.enter(this.amount.text, config);
  ```
2.增加强制关闭键盘功能，此时调用不会触发`close`回掉函数，也没有关闭动画。
  示例：
  `Sail.keyboard.close();`
3.更改首次输入时覆盖之前输入的值
  例如：当前默认值为12345，输入时按了6，则当前值为6
