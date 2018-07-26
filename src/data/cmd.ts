/** 服务器命令  */
export const CMD = {
    /** 卡包列表  */
    CARD_TYPE_LIST: 'cardTypeList',
    /** 游戏复盘 */
    GAME_REPLAY: 'gameReplay',
    /** 游戏开始 */
    GAME_START: 'gameStart',
    /**  体力和骨头  */
    GET_USER_AMOUNT: 'getUserAmount',
    /** 用户信息 */
    GET_USER_INFO: 'getUserInfo',
    /** 加入房间  */
    JOIN_ROOM: 'joinRoom',
    /** 离开房间 */
    OUT_ROOM: 'outRoom',
    /** 创建房间 */
    CREATE_ROOM: 'createRoom', // tslint:disable-line:object-literal-sort-keys
    /** 更新用户个数  */
    UPDATE_USER: 'updateUser',
    /** 出牌  */
    HIT: 'hit',
    /** 拿牌  */
    TAKE: 'take',
    /** 轮次变化  */
    TURNS: 'turns',
    /** 房主修改卡组 */
    CHANGE_CARD_TYPE: 'changeCardType',
    /** 用户淘汰 */
    USER_EXPLODING: 'userExploding',
    /** 游戏结束 */
    GAME_OVER: 'gameOver',
    /** 邀请再来一局 */
    PLAY_INVITE: 'playInvite',
    /** 倒计时 */
    ALARM: 'alarm',
    /**再来一局 */
    PLAY_AGAIN: 'playAgain',
    /**同意/拒绝再来一局 */
    UPDATE_INVITE: 'updateInvite',
};
