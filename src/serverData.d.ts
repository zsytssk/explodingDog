type UserStatusData = string;

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
    shouLen: number;
};

type UpdateUser = {
    userList: UserData[];
    roomId: string;
};
type GameReplayData = {
    userList: UserData[];
    shou: [];
    userId: string;
    userStatus: UserStatusData;
    roundInfo: {
        turnDirection: 1; // 轮转方向
        speakerId: 3001; // 说话人id
        lastHitCard: '';
    };
};
