import { CMD } from '../../data/cmd';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { cmd as base_cmd } from '../../mcTree/event';
import { getChildren, log, logErr } from '../../mcTree/utils/zutil';
import {
    isCurPlayer,
    formatGameReplayData,
    formatUpdatePlayersData,
} from '../../utils/tool';
import { Hall } from '../hall/scene';
import { BillBoardCtrl } from './billboard';
import { CardHeapCtrl } from './cardHeep/main';
import { DiscardZoneCtrl } from './discardZone';
import { DockerCtrl } from './docker';
import { HostZoneCtrl } from './hostZoneCtrl';
import { CardModel } from './model/card/card';
import {
    CardType,
    cmd as game_cmd,
    GameModel,
    GameStatus,
    GAME_STATUS,
    GAME_TYPE,
} from './model/game';
import { PlayerModel } from './model/player';
import { QuickStartCtrl } from './quickStart';
import { CardCtrl } from './seat/cardBox/card';
import { CurSeatCtrl } from './seat/curSeat';
import { SeatCtrl } from './seat/seat';
import { TurnArrowCtrl } from './turnArrow';
import { GiveCardCtrl } from './widget/giveCard';
import { AlarmCtrl } from './widget/alarm';
import { ExplodePosCtrl } from './widget/explodePos';
import { SlapCtrl } from './widget/slap';
import { PopupUserExploded } from '../popup/popupUserExploded';
import { PopupGameOver } from '../popup/popupGameOver';
import { PopupPrompt } from '../popup/popupPrompt';
import { PopupTip } from '../popup/popupTip';
import { PopUpInvite } from '../popup/popupInvite';
import { PopupTakeExplode } from '../popup/popupTakeExplode';
import { ChatCtrl } from './widget/chat';

interface Link {
    view: ui.game.mainUI;
    docker_ctrl: DockerCtrl;
    discard_zone_ctrl: DiscardZoneCtrl;
    btn_back: Laya.Button;
    btn_setting: Laya.Button;
    seat_ctrl_list: SeatCtrl[];
    quick_start_ctrl: QuickStartCtrl;
    host_zone_ctrl: HostZoneCtrl;
    turn_arrow_ctrl: TurnArrowCtrl;
    bill_board_ctrl: BillBoardCtrl;
    card_heap_ctrl: CardHeapCtrl;
    give_card_ctrl: GiveCardCtrl;
    alarm_ctrl: AlarmCtrl;
    slap_ctrl: SlapCtrl;
    game_zone: Laya.Sprite;
    explode_pos_ctrl: ExplodePosCtrl;
    chat_ctrl: ChatCtrl;
}

const max_user_count: number = 5;
const seat_position = {
    1: [[15, 0]],
    2: [[25, -295], [25, 295]],
    3: [[35, -320], [15, 0], [35, 320]],
    4: [[60, -420], [20, -140], [20, 140], [60, 420]],
};

export const cmd = {
    discard: 'discard',
};
export class GameCtrl extends BaseCtrl {
    public is_top = true;
    public name = 'game';
    public link = {} as Link;
    protected is_ready = false;
    private actions = {} as SailIoAction;
    protected model = new GameModel();
    public cur_seat_id: number;
    public cur_user_id: string;
    constructor(view: ui.game.mainUI) {
        super();
        this.link.view = view;

        /** @test */
        (window as any).game_ctrl = this;
    }
    public init() {
        this.initLink();
        this.initEvnet();
    }
    protected initLink() {
        const view = this.link.view;
        const {
            alarm,
            billboard,
            btn_back,
            btn_setting,
            card_heap,
            discard_zone,
            docker,
            game_zone,
            give_card,
            host_zone,
            seat_wrap,
            turn_arrow,
            explode_pos,
            chatview
        } = view;
        const quick_start_ctrl = new QuickStartCtrl(
            view.banner_match,
            view.banner_countdown,
        );
        this.addChild(quick_start_ctrl);
        quick_start_ctrl.init();

        const host_zone_ctrl = new HostZoneCtrl(host_zone);
        this.addChild(host_zone_ctrl);
        host_zone_ctrl.init();

        const docker_ctrl = new DockerCtrl(docker);
        this.addChild(docker_ctrl);
        docker_ctrl.init();

        const slap_ctrl = new SlapCtrl();
        this.addChild(slap_ctrl);
        slap_ctrl.init();

        const discard_zone_ctrl = new DiscardZoneCtrl(discard_zone);
        this.addChild(discard_zone_ctrl);
        discard_zone_ctrl.init();

        const card_heap_ctrl = new CardHeapCtrl(card_heap);
        this.addChild(card_heap_ctrl);
        card_heap_ctrl.init();

        const turn_arrow_ctrl = new TurnArrowCtrl(turn_arrow);
        this.addChild(turn_arrow_ctrl);
        turn_arrow_ctrl.init();

        const bill_board_ctrl = new BillBoardCtrl(billboard);

        const alarm_ctrl = new AlarmCtrl(alarm);
        this.addChild(alarm_ctrl);
        alarm_ctrl.init();

        const give_card_ctrl = new GiveCardCtrl(give_card);
        this.addChild(give_card_ctrl);
        give_card_ctrl.init();

        const explode_pos_ctrl = new ExplodePosCtrl(explode_pos);
        this.addChild(explode_pos_ctrl);

        const chat_ctrl = new ChatCtrl(chatview);
        this.link.chat_ctrl = chat_ctrl;

        /** 座位控制器 */
        const seat_view_list = getChildren(seat_wrap);
        const seat_ctrl_list = [];
        for (let i = 0; i < seat_view_list.length; i++) {
            let player_ctrl;
            if (i === 0) {
                player_ctrl = new CurSeatCtrl(seat_view_list[i]);
            } else {
                player_ctrl = new SeatCtrl(seat_view_list[i]);
            }
            this.addChild(player_ctrl);
            player_ctrl.init();
            seat_ctrl_list.push(player_ctrl);
        }

        this.link = {
            ...this.link,
            alarm_ctrl,
            bill_board_ctrl,
            btn_back,
            btn_setting,
            card_heap_ctrl,
            discard_zone_ctrl,
            docker_ctrl,
            explode_pos_ctrl,
            game_zone,
            give_card_ctrl,
            host_zone_ctrl,
            quick_start_ctrl,
            seat_ctrl_list,
            slap_ctrl,
            turn_arrow_ctrl,
        };
    }
    protected initEvnet() {
        const { discard_zone_ctrl } = this.link;
        this.on(cmd.discard, (data: { card: CardCtrl }) => {
            discard_zone_ctrl.borrowCard(data.card);
        });

        this.actions = {
            [CMD.GAME_REPLAY]: this.onServerGameReplay,
            [CMD.UPDATE_USER]: this.onServerUpdateUser,
            [CMD.GAME_START]: this.onServerGameStart,
            [CMD.OUT_ROOM]: this.onServerOutRoom,
            [CMD.HIT]: (data: HitData, code) => {
                if (code !== 200) {
                    this.model.unDiscardCard(data);
                } else {
                    this.model.discardCard(data);
                }
            },
            [CMD.TAKE]: this.onServerTake,
            [CMD.TURNS]: this.onServerTurn,
            [CMD.CHANGE_CARD_TYPE]: this.onServerChangeCardType,
            [CMD.USER_EXPLODING]: this.onServerUserExploding,
            [CMD.GAME_OVER]: this.onServerGameOver,
            [CMD.JOIN_ROOM]: this.onServerJoinRoom,
            [CMD.ALARM]: this.onServerAlarm,
            [CMD.PLAY_INVITE]: this.onServerPlayInvite,
            [CMD.UPDATE_INVITE]: this.onServerUpdateInvite,
            [CMD.PLAY_AGAIN]: this.onServerPlayAgain,
            [CMD.GET_CHAT_LIST]: this.OnServerGetChatList,
            [CMD.SEND_CHAT]: this.onServerSendChat,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GAME_REPLAY);

        const { btn_back, btn_setting } = this.link;

        btn_back.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(
                new PopupPrompt('是否要退出游戏？', () => {
                    Sail.io.emit(CMD.OUT_ROOM);
                }),
            );
        });

        btn_setting.on(Laya.Event.CLICK, this, () => {
            log('btn_setting');
        });

        this.onModel(game_cmd.add_player, (data: { player: PlayerModel }) => {
            this.addPlayer(data.player);
        });
        this.onModel(game_cmd.status_change, (data: { status: GameStatus }) => {
            this.setStatus(data.status);
        });
        this.onModel(
            game_cmd.card_type_change,
            (data: { card_type: CardType }) => {
                this.link.host_zone_ctrl.setCardType(data.card_type);
            },
        );
        this.onModel(game_cmd.discard_card, (data: { card: CardModel }) => {
            this.link.discard_zone_ctrl.discardCard(data.card);
        });
        this.onModel(base_cmd.destroy, (data: { status: GameStatus }) => {
            this.outRoom();
        });
        this.onModel(
            game_cmd.update_bill_board,
            (data: { fromUser; toUser; cardId; step }) => {
                this.link.bill_board_ctrl.addMsg(data);
            },
        );
    }
    /** 游戏复盘逻辑 */
    public onServerGameReplay(data: GameReplayData) {
        const { quick_start_ctrl, card_heap_ctrl, docker_ctrl } = this.link;
        const { roomInfo, roundInfo } = data;
        this.is_ready = true;
        /** 更新本地倒计时 */
        data = formatGameReplayData(data);
        this.calcCurSeatId(data.userList);

        if (roomInfo) {
            quick_start_ctrl.countDown(roomInfo.remainTime);
            this.onServerAlarm(roomInfo.alarm);
        }

        if (roundInfo) {
            this.model.remainCard = roundInfo.remainCard;
            card_heap_ctrl.setRemainCard(roundInfo.remainCard);
            docker_ctrl.setRate(roundInfo.bombProb);
            const turnDirection = roundInfo.turnDirection;
            if (turnDirection) {
                this.link.turn_arrow_ctrl.rotate(turnDirection);
            }
        }

        this.model.gameReplay(data);
    }
    /** 更新用户的个数 */
    public onServerUpdateUser(data: UpdateUserData) {
        if (!this.is_ready) {
            return;
        }
        data = formatUpdatePlayersData(data);
        /** 更新本地倒计时 */
        this.link.quick_start_ctrl.countDown(data.roomInfo.remainTime);
        this.calcCurSeatId(data.userList);
        this.model.updatePlayers(data.userList);
    }
    private calcCurSeatId(user_list: UserData[]) {
        if (this.cur_seat_id) {
            return;
        }
        for (const user of user_list) {
            if (isCurPlayer(user.userId)) {
                this.cur_seat_id = Number(user.seatId);
            }
        }
    }
    /** 游戏开始 */
    public onServerGameStart(data: GameStartData, code?: string, msg?: string) {
        if (Number(code) !== 200) {
            Sail.director.popScene(new PopupTip(msg));
            return;
        }
        this.model.setGameStatus(GAME_STATUS[2] as GameStatus);
        this.model.updatePlayersCards(data);
    }
    /** 拿牌 */
    private onServerTake(data: TakeData, code?: string) {
        const { docker_ctrl, card_heap_ctrl } = this.link;
        if (Number(code) !== 200) {
            card_heap_ctrl.withDrawTake();
            return;
        }
        this.model.addPlayerCard(data);
        docker_ctrl.setRate(data.bombProb);
        this.model.remainCard = data.remainCard;
        card_heap_ctrl.setRemainCard(data.remainCard);
    }
    public onServerTurn(data: TurnsData) {
        this.model.setSpeaker(data.speakerId);
    }
    /** 离开房间 */
    private onServerOutRoom(data: OutRoomData) {
        if (isCurPlayer(data.userId)) {
            this.outRoom();
        }
    }
    /** 添加用户 */
    private addPlayer(player: PlayerModel) {
        const { seat_ctrl_list } = this.link;
        let local_id;
        if (player.is_cur_player) {
            local_id = 0;
        } else {
            local_id = this.serverIdToLocal(player.seat_id);
        }
        /** 当前用户在为加入房间中要显示的特殊处理 */
        if (local_id === -1) {
            logErr('player local_id = -1', player);
            return;
        }
        const seat_ctrl = seat_ctrl_list[local_id];
        seat_ctrl.loadPlayer(player);
    }
    /** 将服务器id 转换为 */
    public serverIdToLocal(server_id: number) {
        const cur_seat_id = this.cur_seat_id;
        if (!cur_seat_id) {
            return -1;
        }
        let local_id = server_id - cur_seat_id;
        if (local_id < 0) {
            local_id += max_user_count;
        }
        return local_id;
    }
    /**
     * ! 将客户端id转换为客户端服务器id
     */
    public localIdToServer(local_id: number) {
        const cur_seat_id = this.cur_seat_id;
        if (!cur_seat_id) {
            return -1;
        }
        let server_id = local_id + cur_seat_id;
        if (server_id > max_user_count) {
            server_id -= max_user_count;
        }
        return server_id;
    }
    private onServerChangeCardType(data: ChangeCardType) {
        const card_type = Number(data.newCardType);
        this.model.setCardType(card_type);
    }
    /** 牌飞行动画的位置。。。 */
    public getWidgetBox() {
        const { view } = this.link;
        return view.widget_wrap;
    }
    /** 根据游戏的状态显示不同的ui */
    private setStatus(status: GameStatus) {
        const {
            docker_ctrl,
            game_zone,
            host_zone_ctrl,
            quick_start_ctrl,
        } = this.link;
        const game_type = this.model.game_type;
        if (status === GAME_STATUS.INIT) {
            game_zone.visible = false;
            docker_ctrl.reset();
            if (game_type === GAME_TYPE.HOST) {
                const { room_id, create_user_id } = this.model;
                const is_cur_create = isCurPlayer(create_user_id);
                host_zone_ctrl.show(room_id, is_cur_create);
            } else {
                quick_start_ctrl.show();
            }
            return;
        }
        this.updateSeatPos();
        this.link.turn_arrow_ctrl.showArrow(this.model.getPlayerNum());
        docker_ctrl.start();
        if (game_type === GAME_TYPE.HOST) {
            host_zone_ctrl.hide();
        } else {
            quick_start_ctrl.hide();
        }
        game_zone.visible = true;
    }

    /**
     * 刷新用户座位的显示和位置
     */
    private updateSeatPos() {
        const playerNum = this.model.getPlayerNum();
        if (playerNum === 5) {
            return;
        }
        let orderIndex = 0;
        this.link.seat_ctrl_list.slice(1).forEach(seatCtrl => {
            if (seatCtrl.loadedPlayer) {
                seatCtrl.updatePos(seat_position[playerNum - 1][orderIndex]);
                orderIndex++;
            } else {
                seatCtrl.hideSeat();
            }
        });
    }
    /**
     * 重置用户座位的显示和位置
     */
    private resetSeatPos() {
        this.link.seat_ctrl_list.slice(1).forEach((seatCtrl, index) => {
            seatCtrl.showSeat();
            seatCtrl.updatePos(seat_position[4][index]);
        });
    }
    /**
     * 用户淘汰
     */
    public onServerUserExploding(data: UserExplodingData) {
        const { explodeUserId, bombProb } = data;
        let delay = 0;
        const popupUserExploded = new PopupUserExploded();
        popupUserExploded.updateData(data);
        if (isCurPlayer(explodeUserId)) {
            delay = 3000;
            Sail.director.popScene(new PopupTakeExplode());
        }
        Laya.timer.once(delay, this, () => {
            Sail.director.popScene(popupUserExploded);
            this.link.docker_ctrl.setRate(bombProb);
            this.model.playerExploding(data);
        });
    }
    OnServerGetChatList(data) {
        this.link.chat_ctrl.loadMsg(data.list);
    }
    public onServerGameOver(data) {
        const pop = new PopupGameOver(this);
        pop.updateView(data);
        let delay = 0;
        if (Sail.director.getDialogByName('popup_defuse')) {
            Sail.director.closeByName('popup_defuse');
            delay = 3000;
        }
        // 当前玩家爆炸延迟弹出结束
        Laya.timer.once(delay, this, () => {
            Sail.director.popScene(pop);
        });
    }
    public onServerAlarm(data: AlarmData) {
        if (!data) {
            return;
        }
        const { speakerId: user_id, remainTime } = data;
        const { alarm_ctrl } = this.link;
        if (isCurPlayer(user_id)) {
            alarm_ctrl.countDown(remainTime);
        } else {
            alarm_ctrl.reset();
        }
    }
    public reset() {
        const {
            alarm_ctrl,
            give_card_ctrl,
            slap_ctrl,
            card_heap_ctrl,
            discard_zone_ctrl,
            docker_ctrl,
            turn_arrow_ctrl
        } = this.link;

        alarm_ctrl.reset();
        give_card_ctrl.reset();
        slap_ctrl.reset();
        card_heap_ctrl.reset();
        discard_zone_ctrl.reset();
        docker_ctrl.reset();
        turn_arrow_ctrl.reset();
        this.cur_seat_id = undefined;
        this.resetSeatPos();
    }
    public destroy() {
        this.offModel();
        this.model.destroy();
        Sail.io.unregister(this.actions);
        super.destroy();
    }
    public outRoom() {
        Sail.director.closeAll();
        Sail.director.runScene(new Hall());
        this.destroy();
    }
    public getCardType() {
        return this.model.card_type;
    }

    /**
     * @param data快速匹配再来一局
     * @param code
     */
    public onServerJoinRoom(data, code) {
        if (code === 200) {
            this.reset();
            Sail.io.emit(CMD.GAME_REPLAY);
        }
    }
    /** 邀请再来一局 */
    public onServerPlayInvite(data, code) {
        if (code !== 200) {
            return;
        }
        if (!isCurPlayer(data.inviteInfo.userId)) {
            Sail.director.popScene(
                new PopUpInvite(data.inviteInfo.nickname, data.remainTime),
            );
        }
        const gameOver = Sail.director.getDialogByName('game_over');
        gameOver.btnAgain.visible = false;
        gameOver.showInviteIcon(data);
    }

    public onServerUpdateInvite(data, code, msg) {
        if (code !== 200) {
            Sail.director.popScene(new PopupTip(msg));
            return;
        }
        const gameOver = Sail.director.getDialogByName('game_over');
        if (gameOver) {
            gameOver.updateInviteIcon(data);
        }
    }

    public onServerPlayAgain() {
        Sail.io.emit(CMD.GAME_REPLAY);
        Sail.director.closeByName('game_over');
        this.reset();
    }

    public popChat() {
        this.link.chat_ctrl.show();
    }

    public onServerSendChat(data) {
        let seatId = this.model.getServerSeatIdByUserId(data.userId);
        const seat = this.link.seat_ctrl_list[this.serverIdToLocal(seatId)];
        log(data.userId)
        log(seatId, this.serverIdToLocal(seatId))
        log(seat);
        seat && seat.showChat(data.content);
    }
    /**剩余张数 */
    public getRemainCardNum() {
        return this.model.remainCard;
    }
}
