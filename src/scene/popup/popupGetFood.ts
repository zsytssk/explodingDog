import { CMD } from '../../data/cmd';

export class PopupGetFood extends ui.popup.popupGetFoodUI {
    name = 'popup_get_food';
    actions = {};
    constructor() {
        super();
        this.init();
    }

    init() {
        this.initLink();
        this.initEvent();
    }

    private initLink() {
        const {
            txt_stamina,
            txt_time,
            txt_count,
            btn_get,
        } = this;

        this.link = {
            ...this.link,
            txt_stamina,
            txt_time,
            txt_count,
            btn_get,
        };
    }

    private initEvent() {
        this.actions = {
            [CMD.DOG_FOOD_CONFIG]: this.renderData,
            [CMD.GET_DOG_FOOD]: this.getDogFood,
        };
        Sail.io.register(this.actions, this);
        Sail.io.emit(CMD.DOG_FOOD_CONFIG);

        const { btn_get } = this.link;
        btn_get.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.GET_DOG_FOOD);
        });
    }

    private renderData(data: DogConfigData) {
        const { txt_time, txt_stamina, txt_count } = this.link;
        const { time, stamina, getCount, totalCount } = data;
        let timeStr = '';
        for (let arr of time) {
            let [t1, t2] = arr;
            if (timeStr.length) {
                timeStr += '、';
            }
            timeStr += `${t1}-${t2}`;
        }
        txt_time.text = timeStr;
        txt_stamina.text = stamina;
        this.updateCountStatus({ getCount, totalCount });
    }

    private getDogFood(data: GetDogFoodData) {
        // TODO: 领取后更新大厅的体力值数据
        const { newStamina, getCount, totalCount } = data;
        this.updateCountStatus({ getCount, totalCount });
    }

    private updateCountStatus({ getCount, totalCount }) {
        const { txt_count, btn_get } = this.link;
        txt_count.text = `(${getCount}/${totalCount})`;
        if (!totalCount || getCount >= totalCount) {
            btn_get.disabled = true;
        }
    }

    destroy() {
        super.destroy();
        Sail.io.unregister(this.actions);
    }
}
