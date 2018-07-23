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
    shou?: string[];
};

type UpdateUser = {
    roomInfo: RoomInfoData;
    userList: UserData[];
};
type RoomInfoData = {
    /** 是否是用户创建房间 */
    isUserCreate: '0' | '1';
    cardType: CardTypeData;
    roomId: string;
    roomStatus: RoomStatusData;
    userCount: string;
    remainTime: number;
    createUser: '';
    createTime: string;
    activeTime: string;
    danGrading: string;
    roundId: string;
};
type ReplayHitData = {
    hitUserId: string;
    hitCard: string;
    hitInfo: HitData['hitInfo'];
};
type RoundInfoData = {
    hitData: ReplayHitData;
    turnDirection: DirectionData;
    speakerId: string;
    lastHitUserId: string;
    lastHitCard: string;
    remainCard: 9;
    bombProb: number;
};
type GameReplayData = {
    curUserInfo: UserData;
    userList: UserData[];
    roomInfo: RoomInfoData;
    roundInfo: RoundInfoData;
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
type ChangeCardType = {
    userId: string;
    newCardType: number;
};

type CardData = string;
/**
 *
 */
type ServerCode = '200' | '10010';
type TakeData = {
    userId: string;
    takeCard: string;
    bombProb: number;
    remainCard: number;
};
type HitData = {
    userId?: string;
    hitCard: string;
    hitUserId: string;
    hitInfo?: {
        discard?: 0 | 1;
        card?: string;
        step?: number;
        targetUserId?: string;
        canChooseUserIds?: string[];
        topCards?: string[];
        remainTime?: number;
        bombProb: number;
    };
};
type HitBackData = {
    hitCard: string;
    hitParams?: {
        card?: string;
        step?: number;
        targetUserId?: '4001';
        canChooseUserIds?: string[];
    };
};

type DirectionData = '0' | '1';
type TurnsData = {
    userId: string;
    /**说话人id  */
    speakerId: string;
    /**方向, 0表示顺时针, 1表示逆时针  */
    direction: 0;
    /** 剩余轮次 */
    remainTurn: 1;
};

type UserExplodingData = {
    userId: string;
    userList: Object[];
    explodeUserName: string;
    explodeUserId: string;
    remainUser: number;
    remainCard: number;
    remainBomb: number;
    bombProb: number;
};
