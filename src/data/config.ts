export const CONFIG = {
    cdn_url: (window as CusWindow).GAME_CDN_URL || '',
    cdn_version: (window as CusWindow).CDN_VERSION || '',
    env: 'dev',
    publick_key: (window as CusWindow).publicKey || '',
    redirect_uri: (window as CusWindow).redirect_uri || '',
    site_url: (window as CusWindow).siteUrl || '',
    token: (window as CusWindow).token || '',
    user_id: (window as CusWindow).userId || '',
    user_name: '',
    websocket_url: (window as CusWindow).websocketurl || '',
    music_switch_key: 'exploding_dog_music',
    sound_switch_key: 'exploding_dog_sound',
    is_buy: false,//是否充值回跳
    need_pop_shop: false,//返回大厅是否弹出商城

    //分享文案
    friend_title: '就算你是王者，也会是我的手下败将！',
    frend_msg: '要和我比运气？比智商？来啊，来这里比一比啊！',
    share_icon: (window as CusWindow).siteUrl + 'files/static/game/explodingdog/images/component/icon_share.png',
    room_title: '房间我已经开好，就看你敢不敢进！',
    room_msg: '房间号：******，快来！摸一摸，输的人汪汪汪！'
};
