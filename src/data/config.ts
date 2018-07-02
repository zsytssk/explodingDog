export const CONFIG = {
    env: 'dev',
    user_id: (window as CusWindow).userId || '',
    websocket_url: (window as CusWindow).websocketurl || '',
    publick_key: (window as CusWindow).publicKey || '',
    token: (window as CusWindow).token || '',
    cdn_url: (window as CusWindow).GAME_CDN_URL || '',
    cdn_version: (window as CusWindow).CDN_VERSION || '',
};
