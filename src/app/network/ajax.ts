import { zutil } from '../../utils/zutil';

import { BaseCtrl } from '../component/base';
import { t_primus_event_handler, t_primus_event_handler_item } from './primus';

export class AjaxCtrl extends BaseCtrl {
  readonly name = 'ajax';
  /**
  * primus控制器
  * @param config primus的设置信息
  */
  private event_handler_list: t_primus_event_handler_item[] = [];
  constructor() {
    super();
  }
  init() {

  }
  public request(_url: string, data?, data_type?) {
    if (this.hasEventHandler(_url, data)) {
      return;
    }
    zutil.log('ajax请求：' + JSON.stringify(_url));
    $.ajax({
      type: "GET",
      url: _url,
      dataType: data_type || 'json',
      timeout: 20000,
      success: (data) => {
        // if (data.code === "000") {
        this.trigger(_url, data);
        return true;
        // }
        // 这里面需要处理一大堆的异常
      },
      error: function () {
        // 这里面需要处理一大堆的异常
      }
    });
  }
  private hasEventHandler(event_name: string, data?) {
    let handler_list = this.event_handler_list;
    for (let i = 0; i < handler_list.length; i++) {
      let handler = handler_list[i].handler;
      if (handler(event_name, data)) {
        return true;
      }
    }
    return false;
  }
  /**添加事件的处理*/
  public addEventHandler(handler: t_primus_event_handler) {
    let off = () => {
      this.offEventHandler(handler)
    }
    let item = {
      handler: handler,
      off: off
    }
    this.event_handler_list.unshift(item);
    return off;
  }
  /**添加事件的处理*/
  public offEventHandler(handler: t_primus_event_handler) {
    let handler_list = this.event_handler_list;
    for (let len = handler_list.length, i = len - 1; i >= 0; i--) {
      let local_handler = handler_list[i].handler;
      if (local_handler == handler) {
        handler_list.splice(i, 1);
      }
    }
  }
  /**primus返回数据, 用来模拟服务器数据返回 */
  public emitBackEvent(event: string, data) {
    /**异步返回数据 */
    setTimeout(() => {
      this.trigger(event, data);
    });
  }
}