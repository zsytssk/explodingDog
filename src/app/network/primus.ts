import { default as JSEncrypt } from 'jsencrypt';
import { detectModel, extendUtil, log } from '../../utils/zutil';
import { AppCtrl } from '../app';
import { BaseCtrl } from '../component/base';

interface Link {
    app: AppCtrl;
}

type t_primus_status = 'disconnected' | 'connected';

type t_primus_config = {
    /** 用户的token */
    token?: string;
    /** 用户的user_id */
    user_id?: string;
    /** 用户的primus的服务器地址 */
    server_url?: string;
    /** 本地生成的加密字符串 */
    commKey?: string;
    /** 用户加密的字符串 */
    jwt_token?: string;
    /** 客户端用来加密的公共key */
    public_key?: string;
    /** 加密之后字符串, 传给服务器 */
    encrypted_string?: string;
};

export const CMD = {
    disconnect: 'server::disconnect',
    error: 'server::error',
    init: 'server::init',
    status: 'server::status',
};

export type t_primus_event_handler = (event: string, data?) => boolean;
export type t_primus_event_handler_item = {
    handler: t_primus_event_handler;
    off: FuncVoid;
};
/** primus控制器 */
export class PrimusCtrl extends BaseCtrl {
    protected link = {} as Link;
    private config: t_primus_config = {
        token: '',
        user_id: '',
        server_url: '',
        commKey: '',
        jwt_token: '',
        public_key: '',
        encrypted_string: '',
    };
    /** 所有的命令 */
    public readonly name = 'primus';
    /** 和服务器通信的中间件 */
    private primus: Primus;
    /** 状态: 有没有连接服务器 */
    private status: t_primus_status = 'disconnected';
    /**
     * primus控制器
     * @param config primus的设置信息
     */
    private event_handler_list: t_primus_event_handler_item[] = [];
    constructor(config: t_primus_config) {
        super();
        extendUtil(this.config, config, null);
    }
    public init() {
        this.initEncrypt();
        this.connectServer();
    }
    private initEncrypt() {
        const config = this.config;

        // 默认32位编码
        config.commKey =
            Date.parse(new Date().toString()).toString() +
            Date.parse(new Date().toString()).toString() +
            Date.parse(new Date().toString())
                .toString()
                .substring(0, 6);
        const params = 'jwt=' + config.token + '&commKey=' + config.commKey;
        const jsencrypt = new JSEncrypt();
        jsencrypt.setPublicKey(config.public_key);
        config.encrypted_string = jsencrypt.encrypt(params);
    }
    /**  连接服务器  */
    public connectServer() {
        const config = this.config;
        try {
            const primus = new Primus(config.server_url, {
                reconnect: {
                    max: 10000,
                    min: 500,
                    retries: 10,
                },
            });

            primus.on('outgoing::url', url => {
                url.query = 'login=' + config.encrypted_string;
                log('outgoing::url', url.query);
            });

            primus.on('open', () => {
                // 防止 reconnect 之后重复触发 open，以下事件只绑定一次
                if (this.status === 'connected') {
                    return;
                }

                log('连接成功');
                this.primus = primus;
                this.status = 'connected';
                this.trigger(CMD.status, 'connected');
            });

            primus.on('data', data => {
                this.handleReceiveData(data);
                this.trigger(CMD.status, 'data');
            });

            primus.on('disconnection', () => {
                this.status = 'disconnected';
                log('连接断开');
                this.trigger(CMD.status, 'disconnection');
            });

            primus.on('reconnect', () => {
                log('重连中');
                this.trigger(CMD.status, 'reconnect');
            });

            primus.on('reconnected', () => {
                log('重连成功');
                this.trigger(CMD.status, 'reconnected');
            });

            primus.on('close', () => {
                this.status = 'disconnected';
                log('连接断开');
                this.trigger(CMD.status, 'close');
            });

            primus.on('error', err => {
                log('连接出错', err.stack);
                this.trigger(CMD.status, 'error');
            });

            primus.on('end', () => {
                this.status = 'disconnected';
                log('连接已关闭');
                this.trigger(CMD.status, 'end');
            });
        } catch (e) {
            log(e);
        }

        return this;
    }
    public emitToServer(event: string, data?) {
        /** 发送到socket的数据 */
        const config = this.config;
        const send_data: t_any_obj = {};

        if (this.hasEventHandler(event, data)) {
            return;
        }

        send_data.cmd = event;
        send_data.params = {};
        if (detectModel('autoTest')) {
            send_data.params.uid = config.user_id;
        }
        if (data) {
            for (const i in data) {
                if (!data.hasOwnProperty(i)) {
                    continue;
                }
                send_data.params[i] = data[i];
            }
        }
        send_data.params.token = config.token;

        this.emitDataToServer(send_data);
    }
    private hasEventHandler(event_name: string, data?) {
        const handler_list = this.event_handler_list;
        for (const handler of handler_list) {
            const handler_fun = handler.handler;
            if (handler_fun(event_name, data)) {
                return true;
            }
        }
        return false;
    }
    /** 添加事件的处理 */
    public addEventHandler(handler: t_primus_event_handler) {
        const off = () => {
            this.offEventHandler(handler);
        };
        const item = {
            handler,
            off,
        };
        this.event_handler_list.unshift(item);
        return off;
    }
    /** 添加事件的处理 */
    public offEventHandler(handler: t_primus_event_handler) {
        const handler_list = this.event_handler_list;
        for (let len = handler_list.length, i = len - 1; i >= 0; i--) {
            const local_handler = handler_list[i].handler;
            if (local_handler === handler) {
                handler_list.splice(i, 1);
            }
        }
    }
    /** primus返回数据, 用来模拟服务器数据返回  */
    public emitBackEvent(event: string, data) {
        /** 异步返回数据  */
        setTimeout(() => {
            this.trigger(event, data);
        });
    }
    private emitDataToServer(data) {
        const config = this.config;
        const primus = this.primus;
        const status = this.status;

        // 没有连接服务器, 如果这时候发过来命令要传给服务器, 需要缓存起来
        if (status === 'disconnected') {
            log(`sever is  disconnected`);
            return;
        }

        // 为data增加token
        if (data.params) {
            data.params.jwt = config.jwt_token;
        } else {
            data.params = {
                jwt: config.jwt_token,
            };
        }
        data.status = {
            time: new Date().getTime(),
        };

        const encrypt_data = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            CryptoJS.enc.Utf8.parse(config.commKey),
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            },
        );

        // 发送加密数据
        log('推送：' + JSON.stringify(data));
        primus.write(encrypt_data.toString());
    }

    /**处理返回的数据
     * @param data 返回的数据
     */
    private handleReceiveData(data) {
        const config = this.config;
        let decrypt_str;
        let dataString;
        // 解密
        decrypt_str = CryptoJS.AES.decrypt(
            data,
            CryptoJS.enc.Utf8.parse(config.commKey),
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            },
        );
        dataString = decrypt_str.toString(CryptoJS.enc.Utf8);
        data = JSON.parse(dataString);
        log('接收:', data.cmd, data);

        // 更新jwt token
        if (data.cmd === CMD.init) {
            config.jwt_token = data.res;
            return;
        }

        const res: t_any_obj = data.res;
        const cmd: string = data.cmd;
        const code = data.code;

        // 异常错误处理
        if (code !== 200) {
            this.trigger(CMD.error, res);
            return;
        }
        if (!res) {
            log('接收: primus server return data.res is undefined!');
            return;
        }

        this.trigger(cmd, res);
    }

    /** 断开 socket 连接
     */
    public disConnect() {
        const primus = this.primus;
        primus.end();
    }
}
