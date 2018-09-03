import { log } from './../../mcTree/utils/zutil';
import { CONFIG } from './../../data/config';
import { popupQRUI } from './../../../laya/src/ui/layaUI.max.all';
import { ValueBar } from './valuebar';
import { PopupSetting } from '../popup/setting/pop';
import { PopupRank } from '../popup/popupRank';
import { PopupGetFood } from '../popup/popupGetFood';
import { PopupAvatar } from '../popup/popupAvatar';
import { PopupCharge } from '../popup/popupCharge';
import { PopupShop } from '../popup/popupShop';
import { hasShareToWx } from '../../utils/tool';
import { popupShare } from '../popup/popupShare';
export class TopBar extends ui.hall.topbarUI {
    public stamina: ValueBar;
    public diamond: ValueBar;
    constructor() {
        super();
        this.init();
    }
    private init() {
        this.stamina.setType('stamina');
        this.diamond.setType('diamond');
        this.initEvent();
    }
    private initEvent() {
        const {
            btn_setting,
            btn_rank,
            btn_get_food,
            btn_home,
            diamond,
            stamina,
            btn_share
        } = this;
        btn_setting.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupSetting());
        });
        btn_rank.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupRank());
        });
        btn_get_food.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupGetFood());
        });
        stamina.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupShop());
        });
        diamond.on(Laya.Event.CLICK, this, () => {
            Sail.director.popScene(new PopupCharge());
        });
        btn_share.on(Laya.Event.CLICK, this, () => {
            let pop;
            if (hasShareToWx()) {
                pop = new popupShare();
            } else {
                pop = new ui.popup.popupQRUI();
                pop.CONFIG = { closeOnSide: true };
                pop.shareText.text = CONFIG.site_url + CONFIG.redirect_uri
            }
            Sail.director.popScene(pop);

        });
        if (GM.backHomeUrl) {
            this.btn_home.visible = true; // 显示home按钮
            this.btn_home.on(Laya.Event.CLICK, this, () => {
                location.href = GM.backHomeUrl;
            });
        }
        if (
            (window as any).GM &&
            GM.isCall_out === 1 &&
            GM.isShowBtnBack_out &&
            GM.btnBackCall_out
        ) {
            this.btn_rank.x = 175;
            this.btn_share.x = 285;
            this.btnBack.visible = true; // 显示返回按钮
            this.btnBack.on(Laya.Event.CLICK, this, () => {
                GM.btnBackCall_out();
            });
        }
    }

    public updateView({ bone, stamina, upperLimit }) {
        this.stamina.setValue([stamina, upperLimit]);
        this.diamond.setValue([bone]);
    }

    public setRedPoint(flag) {
        this.redPoint.visible = flag;
    }
}
