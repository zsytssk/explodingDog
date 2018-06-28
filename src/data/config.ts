/**
 * Primus
 */
export const IO_CONFIG = {
    type: 'primus',
    URL: (window as CusWindow).websocketurl || '',
    publicKey: (window as CusWindow).publicKey,
    token: (window as CusWindow).token || '',
};
/**
 * Socket.IO
 */
// var IO_CONFIG = {
//     type : "socket",
//     URL : websocketurl,
//     token : token,
//     "force new connection" : true,
//     "reconnect" : true
// };
/**
 * Ajax 如果不需要socket连接方式，则默认使用ajax，下面的配置为ajax的默认配置，一般不需要更改
 */
// var IO_CONFIG = {
//     type : "ajax",
//     timeout : 3000
// };

export const GAME_CONFIG = {
    WIDTH: 1334,
    HEIGHT: 750,
    SCREEN_MODE: Laya.Stage.SCREEN_HORIZONTAL, //可选自动横屏:Laya.Stage.SCREEN_HORIZONTAL 或者 自动竖屏:Laya.Stage.SCREEN_VERTICAL
    SCALE_MODE: Laya.Stage.SCALE_FIXED_WIDTH, //自动横屏时选择:Laya.Stage.SCALE_FIXED_WIDTH  自动竖屏时选择:Laya.Stage.SCALE_FIXED_HEIGHT
    DIALOGTYPE: 'multiple', //弹窗模式 single:弹出弹窗时自动关闭其他弹窗, multiple : 允许弹出多层弹窗，可使用"closeOther:true"在弹出时关闭其他弹窗
    VERSION: '02180620',
    BASE_PATH: (window as CusWindow).GAME_CDN_URL || '',
};
