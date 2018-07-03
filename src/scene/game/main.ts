import { CMD } from '../../data/cmd';
import { BaseCtrl } from '../../mcTmpl/ctrl/base';
import { WaitBannerCtrl } from './waitBanner';

/** 游戏状态: 等待 开始 结束 */
type GameStatus = 'wait' | 'start' | 'end';
/** 游戏类型: 快速匹配 房主创建 */
type GameType = 'quick_match' | 'host';

interface Link {
    view: Laya.Node;
    wait_banner_ctrl: WaitBannerCtrl;
}

export class GameCtrl extends BaseCtrl {
    protected link = {} as Link;
    private actions = {} as SailIoAction;
    /** 游戏类型 */
    public type: GameType;
    /** 游戏状态 */
    public status: GameStatus;
    constructor(view: Laya.Node) {
        super();
        this.link.view = view;
    }
    public init() {
        this.initLink();
        this.initEvnet();
    }
    protected initLink() {
        const view = this.link.view;
        const wait_banner_ctrl = new WaitBannerCtrl(
            view.banner_match,
            view.banner_countdown,
        );
        this.addChild(wait_banner_ctrl);
        wait_banner_ctrl.init();
        this.link.wait_banner_ctrl = wait_banner_ctrl;
    }
    protected initEvnet() {
        this.actions = {
            [CMD.GAME_REPLAY]: this.gameReplay,
            [CMD.UPDATE_USER]: this.updateUser,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.GAME_REPLAY);
    }
    /** 游戏复盘逻辑 */
    private gameReplay = data => {};
    /** 更新用户的个数 */
    private updateUser = data => {};
    public destroy() {
        Sail.io.unRegister(this.actions);
    }
    /**  */
    private setGameType(type: GameType) {
        if (type === this.type) {
            return;
        }
    }
    private setGameStatus(status: GameStatus) {
        if (status === this.status) {
            return;
        }
    }
}
