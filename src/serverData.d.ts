/* 玩家状态: 0-init 1-waiting 3-2-seating 3-playing 4-speaking 5-dead */
type UserStatusData = '0' | '1' | '2' | '3' | '4' | '5';
/* 游戏状态: 0-init 2-starting 3-playing  */
type RoomStatusData = '0' | '2' | '3';
/** 牌组类型: 1-基础卡包 2,3-拓展卡包- */
type CardTypeData = '1' | '2' | '3';

type UserData = {
    userId: string;
    nickname: string;
    /** 段位 */
    danGrading: string;
    score: string;
    level: string;
    currentExp: string;
    totalPlayCount: string;
    winPlayCount: string;
    avatar: string;
    isRobot: 1;
    userStatus: UserStatusData;
    roomId: string;
    seatId: string;
    /** 手牌可数 */
    shouLen?: number;
};

type UpdateUser = {
    userList: UserData[];
};
type RoomInfoData = {
    /** 是否是用户创建房间 */
    isUserCreate: '0' | '1';
    cardType: CardTypeData;
    roomId: string;
    roomStatus: RoomStatusData;
    userCount: string;
    createUser: '';
    createTime: string;
    activeTime: string;
    danGrading: string;
    roundId: string;
};
type GameReplayData = {
    curUserInfo: UserData;
    userList: UserData[];
    shou: string[];
    roomInfo: RoomInfoData;
};

type GameStartData = {
    userId: 2001;
    userList: UserData[];
    /** 当前手牌 */
    shou: string[];
    /** 炸弹概率 */
    bombProb: 12;
    /** 剩余排数 */
    remainCard: 20;
};