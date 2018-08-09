export const CONFIG = {
    cdn_url: (window as CusWindow).GAME_CDN_URL || '',
    cdn_version: (window as CusWindow).CDN_VERSION || '',
    env: 'dev',
    publick_key: (window as CusWindow).publicKey || '',
    redirect_uri: (window as CusWindow).redirect_uri || '',
    site_url: (window as CusWindow).siteUrl || '',
    token: (window as CusWindow).token || '',
    user_id: (window as CusWindow).userId || '',
    websocket_url: (window as CusWindow).websocketurl || '',
    music_switch_key: 'exploding_dog_music',
    sound_switch_key: 'exploding_dog_sound',
};
