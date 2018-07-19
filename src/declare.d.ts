declare let GM: any;

interface CusWindow extends Window {
    GAME_CDN_URL: string;
    CDN_VERSION: string;
    websocketurl: string;
    publicKey: string;
    logout_uri: string;
    gameId: string;
    token: string;
    userId: string;
}

declare namespace Component {
    export class ScaleBox {}
    export class ScaleImg {}
    export class ScaleBtn {}
    export class valueBar {}
}

// declare const ui;

declare class Primus {
    static connect;
    constructor(url, t_any_obj);
    write;
    end;
    on;
    emit;
}

declare const CryptoJS: any;

declare module '*.json' {
    const value: any;
    export default value;
}
