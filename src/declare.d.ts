declare let GM: any;

interface CusWindow extends Window {
    app: any;
    DOMParser: any;
    GAME_CDN_URL: string;
    CDN_VERSION: string;
    websocketurl: string;
    publicKey: string;
    logout_uri: string;
    isVip: string;
    gameId: string;
    guide_step: string;
    newUser: string;
    token: string;
    userId: string;
}

declare const ui;

declare class Primus {
    static connect;
    constructor(url, t_any_obj);
    write;
    end;
    on;
    emit;
}

declare const CryptoJS: any;
