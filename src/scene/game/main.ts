import { CMD } from '../../data/cmd';
import { Hall } from '../hall/scene';
import { event as base_event } from '../../mcTmpl/event';
import { BaseCtrl } from '../../mcTmpl/ctrl/base';
import { getChildren, log } from '../../mcTmpl/utils/zutil';
import { DockerCtrl } from './docker';
import { HostZoneCtrl } from './hostZoneCtrl';
import {
    event,
    GameModel,
    GameStatus,
    GameType,
    game_status_list,
    game_type_list,
} from './model/game';
import { PlayerModel } from './model/player';
import { QuickStartCtrl } from './quickStart';
import { CurSeatCtrl } from './seat/curSeat';
import { SeatCtrl } from './seat/seat';

interface Link {
    view: Laya.Node;
    seat_ctrl_list: SeatCtrl[];
    quick_start_ctrl: QuickStartCtrl;
    host_zone_ctrl: HostZoneCtrl;
    docker_ctrl: DockerCtrl;
    card_heap: Laya.Sprite;
    game_zone: Laya.Sprite;
    discard_zone_ctrl: QuickStartCtrl;
    btn_back: Laya.Button;
    btn_setting: Laya.Button;
}

export class GameCtrl extends BaseCtrl {
    protected link = {} as Link;
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

        this.link.game_zone = view.game_zone;
        this.link.btn_back = view.btn_back;
        this.link.btn_setting = view.btn_setting;
    }
    protected initEvnet() {
        this.actions = {
            [CMD.GAME_REPLAY]: this.gameReplay,
            [CMD.UPDATE_USER]: this.updateUser,
            [CMD.GAME_START]: this.gameStart,
            [CMD.OUT_ROOM]: this.outRoom,
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

        this.onModel(event.add_player, (data: { player: PlayerModel }) => {
            this.addPlayer(data.player);
        });
        this.onModel(event.status_change, (data: { status: GameStatus }) => {
            this.setStatus(data.status);
        });
        this.onModel(base_event.destroy, (data: { status: GameStatus }) => {
            this.leave();
        });
    }
    /** 游戏复盘逻辑 */
    private gameReplay(data: GameReplayData) {
        this.cur_user_id = data.curUserInfo.userId;
        this.cur_seat_id = Number(data.curUserInfo.seatId);
        /** @test  */
        const type_no = data.roomInfo.isUserCreate || 0;
        const status_no = data.roomInfo.roomStatus;
        this.model.setGameType(game_type_list[type_no] as GameType);
        this.model.setGameStatus(game_status_list[status_no] as GameStatus);

        /** 还未加入房间, 要显示当前用户信息, 将当前用户添加到数组中... */
        if (!data.userList.length) {
            data.userList.push(data.curUserInfo);
        }
        this.updateUser(data);
    }
    /** 更新用户的个数 */
    private updateUser(data: UpdateUser) {
        const user_list = data.userList;
        /** 如果当前用户还没有seatId 需要设置seatId
         * 出现在进入房间 但是还在匹配 没有进入游戏 所以没有userId
         */
        if (!this.cur_seat_id) {
            for (const user of user_list) {
                if (user.userId === this.cur_user_id) {
                    this.cur_seat_id = Number(user.seatId);
                }
            }
        }
        this.model.updatePlayers(user_list);
    }
    /** 游戏开始 */
    private gameStart(data: GameStartData) {
        this.model.setGameStatus(game_status_list[2] as GameStatus);
    }
    /** 游戏开始 */
    private outRoom(data: GameStartData) {
        this.model.destroy();
    }
    /** 添加用户 */
    private addPlayer = (player: PlayerModel) => {
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
            const num = this.model.getPlayerNum();
            local_id += num;
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
        const num = this.model.getPlayerNum();
        let server_id = local_id + cur_seat_id;
        if (server_id > num) {
            server_id -= num;
        }
        return server_id;
    }
    /** 根据游戏的状态显示不同的ui */
    private setStatus(status: GameStatus) {
        const {
            game_zone,
            quick_start_ctrl,
            host_zone_ctrl,
            docker_ctrl,
        } = this.link;
        const type = this.model.type;
        if (status === 'init') {
            game_zone.visible = false;
            docker_ctrl.reset();
            if (type === 'host') {
                host_zone_ctrl.show();
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
}
