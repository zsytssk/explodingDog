import { CMD } from '../../data/cmd';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { cmd as base_cmd } from '../../mcTree/event';
import { getChildren, log, logErr } from '../../mcTree/utils/zutil';
import { isCurPlayer } from '../../utils/tool';
import { Hall } from '../hall/scene';
import { BillBoardCtrl } from './billboard';
import { CardHeapCtrl } from './cardHeep';
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
    explode_pos_ctrl: ExplodePosCtrl
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
        } = view;
        const quick_start_ctrl = new QuickStartCtrl(
            view.banner_match,
            view.banner_countdown,
        );
        quick_start_ctrl.init();
        const host_zone_ctrl = new HostZoneCtrl(host_zone);
        this.addChild(host_zone_ctrl);
        host_zone_ctrl.init();

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

        this.link = {
            ...this.link,
            alarm_ctrl,
            bill_board_ctrl,
            btn_back,
            btn_setting,
            card_heap_ctrl,
            discard_zone_ctrl,
            docker_ctrl,
            game_zone,
            give_card_ctrl,
            host_zone_ctrl,
            quick_start_ctrl,
            seat_ctrl_list,
            slap_ctrl,
            turn_arrow_ctrl,
            explode_pos_ctrl
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
            [CMD.OUT_ROOM]: () => {
                this.onServerOutRoom();
            },
            [CMD.HIT]: (data: HitData, code) => {
                if (code !== 200) {
                    this.model.unDiscardCard(data);
                } else {
                    this.model.discardCard(data);
                }
            },
            [CMD.TAKE]: this.onServerTake,
            [CMD.TURNS]: (data: TurnsData) => {
                this.model.setSpeaker(data.speakerId);
            },
            [CMD.CHANGE_CARD_TYPE]: this.onServerChangeCardType,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GAME_REPLAY);

        const { btn_back, btn_setting } = this.link;

        btn_back.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.OUT_ROOM);
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
            this.leave();
        });
    }
    /** 游戏复盘逻辑 */
    public onServerGameReplay(data: GameReplayData) {
        const { quick_start_ctrl, card_heap_ctrl } = this.link;
        this.is_ready = true;
        /** 更新本地倒计时 */
        this.calcCurSeatId(data.userList);
        quick_start_ctrl.countDown(data.roomInfo && data.roomInfo.remainTime);
        card_heap_ctrl.setRemainCard(
            data.roundInfo && data.roundInfo.remainCard,
        );

        this.model.gameReplay(data);
    }
    /** 更新用户的个数 */
    public onServerUpdateUser(data: UpdateUser) {
        if (!this.is_ready) {
            return;
        }
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
            logErr(msg);
            return;
        }
        this.model.setGameStatus(GAME_STATUS[2] as GameStatus);
        this.model.updatePlayersCards(data);
    }
    /** 拿牌 */
    private onServerTake(data: TakeData) {
        const { docker_ctrl, card_heap_ctrl } = this.link;
        this.model.addPlayerCard(data);
        docker_ctrl.setRate(data.bombProb);
        card_heap_ctrl.setRemainCard(data.remainCard);
    }
    /** 离开房间 */
    private onServerOutRoom() {
        this.model.destroy();
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
        const type = this.model.game_type;
        if (status === GAME_STATUS.INIT) {
            game_zone.visible = false;
            docker_ctrl.reset();
            if (type === GAME_TYPE.HOST) {
                const room_id = this.model.room_id;
                host_zone_ctrl.show(room_id);
            } else {
                quick_start_ctrl.show();
            }
            return;
        }
        this.updateSeatPos();
        docker_ctrl.start();
        if (type === GAME_TYPE.HOST) {
            host_zone_ctrl.hide();
        } else {
            quick_start_ctrl.hide();
        }
        game_zone.visible = true;
    }
    private leave() {
        this.destroy();
        Sail.director.runScene(new Hall());
    }
    public destroy() {
        super.destroy();
        Sail.io.unregister(this.actions);
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
}
