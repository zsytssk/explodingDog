import { CMD } from '../../data/cmd';
import { PopupPrompt } from './popupPrompt';
import { PopupTip } from './popupTip';

export class PopupGetFood extends ui.popup.popupGetFoodUI {
    name = 'popup_get_food';
    actions = {};
    private clickBtn;//点击后的领取按钮
    CONFIG = {
        closeOnSide: true
    }
    constructor() {
        super();
        this.init();
    }

    init() {
        this.initEvent();
    }

    private initEvent() {
        this.actions = {
            [CMD.DOG_FOOD_CONFIG]: this.renderData,
            [CMD.GET_DOG_FOOD]: this.getDogFood,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.DOG_FOOD_CONFIG);
    }

    private renderData(data: DogConfigData) {
        data.list.forEach((item, index) => {
            let panel = new ui.popup.component.getFoodUI();
            panel.time.text = item.time[0] + '-' + item.time[1];
            panel.stamina.text = data.stamina.toString();
            if (item.hasGot) {
                panel.btnGet.skin = 'images/pop/getFood/btn_got.png';
                panel.btnGet.mouseEnabled = false;
            } else if (item.canGet) {
                panel.btnGet.on(Laya.Event.CLICK, this, () => {
                    this.clickBtn = panel.btnGet;
                    Sail.io.emit(CMD.GET_DOG_FOOD);
                });
            } else {
                panel.btnGet.disabled = true;
            }
            panel.pos(index * 280, 0);
            this.panelBox.addChild(panel);
        });
    }

    private getDogFood(data: GetDogFoodData, code, msg) {
        if (code !== 200) {
            Sail.director.popScene(
                new PopupTip(msg)
            );
            return;
        }
        this.clickBtn.skin = 'images/pop/getFood/btn_got.png';
        this.clickBtn.mouseEnabled = false;
        Sail.io.emit(CMD.GET_HALL_USER_STATUS, { type: 'dogFood' });
    }

    public destroy() {
        super.destroy();
        Sail.io.unregister(this.actions);
    }
}
