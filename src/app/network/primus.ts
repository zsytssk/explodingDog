import { CMD } from '../../data/cmd';
import { TIP_TXT } from '../../data/tipTxt';
import { zutil } from '../../utils/zutil';
import { BaseCtrl } from '../component/base';
import { AppCtrl } from '../app';

type t_primus_status = 'disconnected' | 'connected';
type t_primus_heart_beat = {
  timestamp: -1,
  time_out: number,
  interval: number,
  isActive: boolean
}
type t_primus_config = {
  /**用户的token*/
  token?: string,
  /**用户的user_id*/
  user_id?: string,
  /**用户的primus的服务器地址*/
  server_url?: string,
  /**本地生成的加密字符串*/
  commKey?: string,
  /**用户加密的字符串*/
  jwt_token?: string,
  /**客户端用来加密的公共key*/
  public_key?: string,
  /**加密之后字符串, 传给服务器*/
  encrypted_string?: string
};
export type t_primus_event_handler = (event: string, data?) => boolean;
export type t_primus_event_handler_item = {
  handler: t_primus_event_handler,
  off: Function
}
/**primus控制器*/
export class PrimusCtrl extends BaseCtrl {
  protected link: i_primusctrl_link = {} as i_primusctrl_link;
  private config: t_primus_config = {
    token: '',
    user_id: '',
    server_url: '',
    commKey: '',
    jwt_token: '',
    public_key: '',
    encrypted_string: ''
  };
  /**所有的命令*/
  readonly name = 'primus';
  /**和服务器通信的中间件*/
  private primus: Primus;
  /**状态: 有没有连接服务器*/
  private _status: t_primus_status = 'disconnected';
  private cache_data_list = [];
  /**
   * primus控制器
   * @param config primus的设置信息
   */
  private event_handler_list: t_primus_event_handler_item[] = [];
  constructor(config: t_primus_config) {
    super();
    zutil.extend(this.config, config, null);
  }
  init() {
    // app 初始化之后初始化
    this.on('app::inited', () => {
      this.initLink();
      this.initEvent();
      this.initEncrypt();
      this.connectServer();
    });
  }
  initLink() {
    this.link.app = zutil.queryClosest((<BaseCtrl>this), 'name:app') as AppCtrl;
  }
  initEvent() { }
  initEncrypt() {
    let config = this.config;

    try {
      //默认32位编码
      config.commKey = Date.parse((new Date()).toString()).toString() + Date.parse((new Date()).toString()).toString() + Date.parse((new Date()).toString()).toString().substring(0, 6);
    } catch (e) {
      zutil.log("初始化commKey失败", e);
    }

    try {
      var params = "jwt=" + config.token + "&commKey=" + config.commKey;
      var jsencrypt = new JSEncrypt();
      jsencrypt.setPublicKey(config.public_key);
      config.encrypted_string = jsencrypt.encrypt(params);
    } catch (e) {
      zutil.log("初始化encrypted string失败", e);
    }
  }
  /** 连接服务器 */
  public connectServer(url?: string) {
    let config = this.config;
    let time_out;
    try {

      let primus = new Primus(config.server_url, {
        reconnect: {
          max: 10000,
          min: 500,
          retries: 10
        }
      });

      primus.on('outgoing::url', (url) => {
        url.query = 'login=' + config.encrypted_string;
        zutil.log("outgoing::url", url.query);
      });

      primus.on('open', () => {
        //防止reconnect之后重复触发open，以下事件只绑定一次
        if (this.status == 'connected') {
          return;
        }

        zutil.log("连接成功");
        this.primus = primus;
        this.status = 'connected';
      });

      primus.on('data', (data) => {
        this.handleRecieveData(data);
      });

      primus.on('disconnection', () => {
        this.status = 'disconnected';
        zutil.log("连接断开");
      });

      primus.on('reconnect', () => {
        zutil.log("重连中");
      });

      primus.on('reconnected', () => {
        zutil.log("重连成功");
      });

      primus.on('close', () => {
        this.status = 'disconnected';
        zutil.log("连接断开");
      });

      primus.on('error', (err) => {
        zutil.log("连接出错", err.stack);
        this.handleConnectError();
      });

      primus.on('end', () => {
        this.status = 'disconnected';
        zutil.log("连接已关闭");
        this.handleConnectError();
      });

    } catch (e) {
      zutil.log(e);
    }

    return this;
  };
  public emitToServer(event: string, data?) {
    /**发送到socket的数据*/
    let config = this.config;
    let send_data: t_any_obj = {};

    if (this.hasEventHandler(event, data)) {
      return;
    }

    send_data.cmd = event;
    send_data.params = {};
    if (zutil.detectModel('autoTest')) {
      send_data.params.uid = config.user_id;
    }
    if (data) {
      for (let i in data) {
        send_data.params[i] = data[i];
      }
    }
    send_data.params.token = config.token;

    this.emitDataToServer(send_data);
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
  private emitDataToServer(data) {
    let config = this.config;
    let primus = this.primus;
    let status = this.status;

    // 没有连接服务器, 如果这时候发过来命令要传给服务器, 需要缓存起来
    if (status == 'disconnected') {
      zutil.log(`sever is  disconnected, cache ${data.cmd}, will send to server until connect sever`);
      this.cache_data_list.push(data);
      return;
    }

    //为data增加token
    if (data.params) {
      data.params.jwt = config.jwt_token;
    } else {
      data.params = {
        jwt: config.jwt_token
      };
    }
    data.status = {
      time: new Date().getTime()
    };

    let encrypt_data = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(config.commKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    //发送加密数据
    zutil.log('推送：' + JSON.stringify(data));
    primus.write(encrypt_data.toString());

  };
  private get status() {
    return this._status;
  }
  private set status(status: t_primus_status) {
    this._status = status;
    if (status == 'connected') {
      this.sendCacheDataToServer();
    }
  }
  /**在服务骑断开的时候缓存命令等到, 服务器链接之后, 再发送给服务器*/
  private sendCacheDataToServer() {
    let len = this.cache_data_list.length;
    for (let i = len - 1; i >= 0; i--) {
      this.emitDataToServer(this.cache_data_list[i]);
      this.cache_data_list.splice(i, 1);
    }
    this.cache_data_list = [];
  }

  /**处理返回的数据
   * @param data 返回的数据
  */
  private handleRecieveData(data) {
    let config = this.config;
    let decryptstr, dataString;
    //解密
    decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(config.commKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    dataString = decryptstr.toString(CryptoJS.enc.Utf8);
    data = JSON.parse(dataString);
    zutil.log("接收:", data.cmd, data);

    // 更新jwt token
    if (data.cmd == CMD.server_init) {
      config.jwt_token = data.res;
      return;
    }

    let res: t_any_obj = data.res;
    let cmd: string = data.cmd;
    let code = data.code;

    // 异常错误处理
    if (code != 200) {
      this.errorHandle(cmd, data);
      return;
    }
    if (!res) {
      zutil.log("接收: pirmus server return data.res is undefined!");
      return;
    }

    this.trigger(cmd, res);
  }

  /** 异常错误处理 */
  private errorHandle(cmd, rep) {
    let app = this.link.app;

    let repCode = rep.code || rep.repCode || rep.res.code;
    repCode = repCode + '';
    let msg = rep.msg;

    this.trigger(CMD.global_error);
    switch (repCode) {
      case CMD.server_upgrade_gun_tip_forge:
        //用户升级炮台条件不足, 锻造提示
        this.broadcast(CMD.global_show, 'app::pop_wrap::forging');
        return;
      case CMD.server_no_diamond:
        // 用户没元宝弹出商城
        app.alert(msg, () => {
          this.broadcast(CMD.global_show, 'app::pop_wrap::mall', { type: 'diamond' });
        });
        return;
      case CMD.server_no_gold:
        // 用户没金币弹出商城
        app.alert(msg, () => {
          this.broadcast(CMD.global_show, 'app::pop_wrap::mall', { type: 'gold' });
        });
        return;
      case CMD.server_error_remote_login:
        // 带出失败
        this.disConnect(TIP_TXT.remote_login);
        return;
    }

    switch (cmd) {
      /**一般错误处理*/
      case CMD.global_error:
        app.alert(msg);
        return;
    }

    app.tip(msg);
  };

  /** socket 连接失败处理 */
  private handleConnectError() {
    let app = this.link.app;
    app.alert(TIP_TXT.network_disconnect, function () {
      zutil.reload();
    }, 'allways_callback');
    zutil.log('primus 连接失败!');
  };

  /** 断开 socket 连接
   * @param tip 提示文字
  */
  public disConnect(tip?: string) {
    let app = this.link.app;
    let primus = this.primus;
    primus.end();
    this.trigger(CMD.server_disconnect);
    app.alert(tip || TIP_TXT.network_disconnect, function () {
      zutil.reload();
    }, 'allways_callback');
  };

}