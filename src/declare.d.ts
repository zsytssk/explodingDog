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
    laya: laya;
}

declare namespace Component {
    export class ScaleBox extends Laya.Box {}
    export class ScaleImg extends Laya.Image {}
    export class ScaleBtn extends Laya.Button {}
    export class valueBar extends Laya.Sprite {}
}

declare namespace laya {
    export namespace components { export class Isbn extends Laya.Sprite {} }
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
