export const CONFIG = {
    env: 'dev',
    // 需要该所有的图片加上一个cdn, 或者 测试domain 前缀
    cdn_url: (window as CusWindow).GAME_CDN_URL || '',
    cdn_version: (window as CusWindow).CDN_VERSION || '',
    websocket_url: (window as CusWindow).websocketurl || '',
    public_key: (window as CusWindow).publicKey || '',
    logout_uri: (window as CusWindow).logout_uri || '',
    is_vip: (window as CusWindow).isVip || '',
    game_id: (window as CusWindow).gameId || '',
    is_new_user: (window as CusWindow).newUser || '',
    guide_step: (window as CusWindow).guide_step,
    token: (window as CusWindow).token || '',
    user_id: (window as CusWindow).userId || '',
    /** 退出到后台的时间 */
    background_logout_time: 3,
    /** 屏幕适配方式 */
    scale_mode:
        Laya.Browser.width / Laya.Browser.height > 1334 / 750
            ? Laya.Stage.SCALE_SHOWALL
            : Laya.Stage.SCALE_FIXED_WIDTH,
};
