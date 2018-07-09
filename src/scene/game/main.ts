import { CMD } from '../../data/cmd';
import { BaseCtrl } from '../../mcTree/ctrl/base';
import { cmd as base_cmd } from '../../mcTree/event';
import { getChildren, log } from '../../mcTree/utils/zutil';
import { Hall } from '../hall/scene';
import { DockerCtrl } from './docker';
import { HostZoneCtrl } from './hostZoneCtrl';
import {
    card_type_map,
    CardType,
    cmd as game_cmd,
    game_status_map,
    GameModel,
    GameStatus,
} from './model/game';
import { PlayerModel } from './model/player';
import { QuickStartCtrl } from './quickStart';
import { CurSeatCtrl } from './seat/curSeat';
import { SeatCtrl } from './seat/seat';
import { TurnArrowCtrl } from './turnArrow';

interface Link {
    view: Laya.Node;
    docker_ctrl: DockerCtrl;
    card_heap: Laya.Sprite;
    game_zone: Laya.Sprite;
    discard_zone_ctrl: QuickStartCtrl;
    btn_back: Laya.Button;
    btn_setting: Laya.Button;
    seat_ctrl_list: SeatCtrl[];
    quick_start_ctrl: QuickStartCtrl;
    host_zone_ctrl: HostZoneCtrl;
    turn_arrow_ctrl: TurnArrowCtrl;
}

const max_user_count: number = 5;
const seat_position = {
    1: [[60, 0]],
    2: [[25, -295], [25, 295]],
    3: [[35, -320], [15, 0], [35, 320]],
    4: [[60, -420], [20, -140], [20, 140], [60, 420]]
}
export class GameCtrl extends BaseCtrl {
    protected link = {} as Link;
    protected is_ready = false;
    private actions = {} as SailIoAction;
    protected model = new GameModel();
    public cur_seat_id: number;
    public cur_user_id: string;
    constructor(view: Laya.Node) {
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
        const view = this.link.view as ui.game.mainUI;
        const quick_start_ctrl = new QuickStartCtrl(
            view.banner_match,
            view.banner_countdown,
        );
        this.addChild(quick_start_ctrl);
        quick_start_ctrl.init();
        this.link.quick_start_ctrl = quick_start_ctrl;
        const host_zone_ctrl = new HostZoneCtrl(view.host_zone);
        this.addChild(host_zone_ctrl);
        host_zone_ctrl.init();
        this.link.host_zone_ctrl = host_zone_ctrl;

        /** 座位控制器 */
        const seat_view_list = getChildren(view.seat_wrap);
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
        this.link.seat_ctrl_list = seat_ctrl_list;

        const docker = view.docker;
        const docker_ctrl = new DockerCtrl(docker);
        this.addChild(docker_ctrl);
        docker_ctrl.init();
        this.link.docker_ctrl = docker_ctrl;

        const turn_arrow = view.turn_arrow;
        const turn_arrow_ctrl = new TurnArrowCtrl(turn_arrow);
        this.addChild(turn_arrow_ctrl);
        turn_arrow_ctrl.init();
        this.link.turn_arrow_ctrl = turn_arrow_ctrl;

        this.link.game_zone = view.game_zone;
        this.link.btn_back = view.btn_back;
        this.link.btn_setting = view.btn_setting;
    }
    protected initEvnet() {
        this.actions = {
            [CMD.GAME_REPLAY]: this.onServerGameReplay,
            [CMD.UPDATE_USER]: this.onServerUpdateUser,
            [CMD.GAME_START]: this.onServerGameStart,
            [CMD.OUT_ROOM]: this.onServerOutRoom,
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
        this.onModel(base_cmd.destroy, (data: { status: GameStatus }) => {
            this.leave();
        });
    }
    /** 游戏复盘逻辑 */
    public onServerGameReplay(data: GameReplayData) {
        this.is_ready = true;
        /** 更新本地倒计时 */
        this.link.quick_start_ctrl.countDown(data.roomInfo.remainTime);
        this.model.gameReplay(data);
    }
    /** 更新用户的个数 */
    public onServerUpdateUser(data: UpdateUser) {
        if (!this.is_ready) {
            return;
        }
        /** 更新本地倒计时 */
        this.link.quick_start_ctrl.countDown(data.roomInfo.remainTime);
        this.model.updatePlayers(data.userList);
    }
    /** 游戏开始 */
    public onServerGameStart(data: GameStartData, code: string, msg: string) {
        if (Number(code) !== 200) {
            alert(msg);
            return;
        }
        this.model.setGameStatus(game_status_map[2] as GameStatus);
    }
    /** 游戏开始 */
    private onServerOutRoom() {
        this.model.destroy();
    }
    /** 添加用户 */
    private addPlayer = (player: PlayerModel) => {
        if (player.is_cur_player) {
            this.cur_seat_id = player.seat_id;
        }
        let local_id = this.serverIdToLocal(player.seat_id);
        /** 当前用户在为加入房间中要显示的特殊处理 */
        if (local_id === -1 && player.user_id === this.cur_user_id) {
            local_id = 0;
        }
        const seat_ctrl = this.link.seat_ctrl_list[local_id];
        seat_ctrl.loadPlayer(player);
    };
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
        const card_type = card_type_map[Number(data.newCardType) - 1];
        this.model.setCardType(card_type);
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
        if (status === 'init') {
            game_zone.visible = false;
            docker_ctrl.reset();
            if (type === 'host') {
                const room_id = this.model.room_id;
                const card_type = this.model.card_type;
                host_zone_ctrl.show(room_id);
            } else {
                quick_start_ctrl.show();
            }
        } else {
            docker_ctrl.start();
            if (type === 'host') {
                host_zone_ctrl.hide();
            } else {
                quick_start_ctrl.hide();
            }
            game_zone.visible = true;
        }
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
        console.log(playerNum)
        if (playerNum == 5) {
            return;
        }
        let orderIndex = 0;
        this.link.seat_ctrl_list.slice(1).forEach(seatCtrl => {
            if (seatCtrl.loadedPlayer) {
                switch (playerNum) {
                    case 2:
                        seatCtrl.updatePos(seat_position[playerNum - 1][orderIndex]);
                        break;
                }
                // seatCtrl.updatePos(100, 100);
            } else {
                seatCtrl.hideSeat();
            }
        });
    }
}
