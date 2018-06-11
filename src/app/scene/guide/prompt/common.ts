import { NodeCtrl } from '../../component/node';
import { animate } from '../../../utils/animate';
import {
    callFunc,
    isFunc
} from '../../../utils/other';
import { zutil } from '../../../utils/zutil';

/**link for prompt*/
export interface i_prompguidectrl_link {
    bd_bg: Laya.Sprite;
    label: Laya.Label;
    html_div: Laya.HTMLDivElement;
}
type label_inner_html_item = {
    string: string;
    style: string;
}
export type t_tip_json_item = {
    color: string;
    msg: string
}
export type t_tip_item = string | t_tip_json_item[];
type t_prompt_dir = 'top' | 'left' | 'bottom' | 'right';
/**提示框显示的位置+方位(用来做显示动画) */
export type t_prompt_location = {
    /*位置 */
    pos: t_point,
    /*方位用于向上 左右 .. 动画出现 */
    dir: t_prompt_dir
}

/**提示弹出层 */
export class PromptGuideCtrl extends NodeCtrl {
    link: i_prompguidectrl_link;
    private tip_msg: t_tip_item[];
    private complete_callback: Function;
    private auto_hide = true;
    /**记录当前显示的位置 */
    private step = -1;
    /**记录当前显示的位置 */
    private step_map: number[];
    /** 正在进行提示 */
    public isTiping = false;
    name = 'prompt';
    constructor(view?) {
        super(view || new ui.guide.promptUI());
    }
    init() {
        this.initLink()
    }
    protected initLink() {
        let view = this.view;
        let bd_bg = zutil.getElementsByName(view, 'bd_bg')[0];
        let label = zutil.getElementsByName(view, 'label')[0] as Laya.Label;
        let html_div = zutil.getElementsByName(view, 'html_div')[0] as Laya.HTMLDivElement;

        html_div.style.color = "#ffffff";
        html_div.style.fontSize = 30;
        html_div.style.lineHeight = 40;

        this.link.bd_bg = bd_bg;
        this.link.label = label;
        this.link.html_div = html_div;
    }
    /**
     * 显示提示信息
     * @param location 弹出显示的位置 用来处理显示的动画
     * @param tip 提示文字
     * @param callback 显示完成callback
     * @param auto_hide 显示完整提示之后是否自动关闭
     */
    prompt(location: t_prompt_location, tip: t_tip_item | t_tip_item[], callback?: Function, auto_hide = true) {
        this.view.pos(location.pos.x, location.pos.y);

        /**只需一屏展示: 字符串, 单个[{color: .., msg:...}, ...]*/
        if (typeof tip == 'string' || (<t_tip_json_item>tip[0]).color) {
            this.tip_msg = [tip] as t_tip_item[];
        } else {
            this.tip_msg = tip as t_tip_item[];
        }

        this.complete_callback = callback;
        this.auto_hide = auto_hide;
        this.isTiping = true;
        this.step_map = this.analysisTip(this.tip_msg);

        this.showTip();
        this.show(location.dir);
    }
    private showTip(step?: number) {
        let tip_msg = this.tip_msg;
        let step_map = this.step_map;

        step = step || 0;

        this.step = step;
        let step_info = this.getStepInfo(step);
        let tip_index = step_info.tip_index;
        let msg_index = step_info.msg_index;

        let html_div = this.link.html_div;
        /** 累计字符个数 用来创建逐字显示setTimout + 显示结束callback */
        let t = 0;
        /** 单个文字显示的时间间隔  */
        let space = 50;
        /**显示所有文字之后 再显示一段时间 */
        let wait_time = 1000;

        let tip_item = tip_msg[tip_index];
        let tip_item_len = step_map[tip_index];
        html_div.innerHTML = this.getTipByLen(tip_item, msg_index + 1);

        /**到达最后一条信息, 完成显示 */
        if (tip_index >= step_map.length - 1 && msg_index >= tip_item_len - 1) {
            this.createTimeout(() => {
                this.complete();
            }, wait_time);
            return;
        }

        /**下一条信息中间要停留时间1秒 */
        if (msg_index >= tip_item_len - 1) {
            space = wait_time;
        }
        this.createTimeout(() => {
            this.showTip(++step);
        }, space);
    }
    /** 通过step计算当前是哪一步 */
    private getStepInfo(step: number) {
        let step_map = this.step_map;

        let tip_index = 0, msg_index = 0, sum = 0;
        for (let i = 0; i < step_map.length; i++) {
            sum += step_map[i];
            if (step <= sum) {
                tip_index = i;
                msg_index = step_map[i] - (sum - step);
                break;
            }
            /** */
            if (i == step_map.length - 1) {

            }
        }
        return {
            /**当前显示第几条信息 */
            tip_index: tip_index,
            /**当前显示信息 个数index*/
            msg_index: msg_index
        }
    }
    /**获取指定长度的tip */
    private getTipByLen(tip: t_tip_item, len: number) {
        /**字符串直接截取 */
        if (typeof tip == 'string') {
            let result = tip.slice(0, len);
            return result;
        }

        /**[{color: .., msg:...}, ...]截取数组item+最后一个item中截取字符 */
        let result = [] as t_tip_json_item[];
        for (let i = 0; i < tip.length; i++) {
            let color = tip[i].color;
            let msg = tip[i].msg;
            len = len - msg.length;
            result.push({
                color: color,
                msg: len >= 0 ? msg : msg.slice(0, len)
            });
            if (len <= 0) {
                break;
            }
        }
        let result_html = this.converJsonToHtml(result);
        return result_html;
    }
    /**将提示的信息json转化为html */
    private converJsonToHtml(tip_data: t_tip_json_item[]) {
        /**拼接字符的模版 */
        var tmp = '<span style="color:{color}">{msg}</span>';
        var html = '';
        for (let i = 0; i < tip_data.length; i++) {
            let tip_item = tip_data[i];
            /**当个item生成的span */
            let html_item = tmp;
            for (var key in tip_item) {
                var reg = new RegExp("{" + key + "}", "g");
                html_item = html_item.replace(reg, tip_item[key]);
            }
            html += html_item;
        }

        return html;
    }
    show(dir: t_prompt_dir) {
        let ani_fun: Function;
        switch (dir) {
            case 'top':
                ani_fun = animate.slide_down_in;
                break;
            case 'right':
                ani_fun = animate.slide_left_in;
                break;
            case 'bottom':
                ani_fun = animate.slide_up_in;
                break;
            case 'left':
                ani_fun = animate.slide_right_in;
                break;
        }
        ani_fun(this.view, 800);
    }
    /**分析提示信息, 将提示信息变成[12,30,..]这种形式
     * step不停的累加 12 + 30 + ...
     * 如果中间有突然显示完整信息将清空原来的所有timeOut直接显示完整信息
     */
    private analysisTip(tip_msg: t_tip_item[]) {
        let step_map = [] as number[];

        for (let i = 0; i < tip_msg.length; i++) {
            let tip_item = tip_msg[i];
            let len = tip_item.length;
            /**计算单个[{color: .., msg:...}, ...]里面字符个数*/
            if (typeof tip_item !== 'string') {
                len = 0;
                for (let i = 0; i < tip_item.length; i++) {
                    len += tip_item[i].msg.length;
                }
            }
            step_map.push(len);
        }
        return step_map;
    }
    /**触发显示完整信息 */
    public showCompletedTip() {
        if (!this.isTiping) {
            return;
        }
        /**清除现在所有正在进行的倒计时 */
        this.clearAllTimeout();
        let step_info = this.getCurTipCompleteStepInfo();

        /**已经显示所有信息直接显示所有信息*/
        if (step_info.is_complete) {
            this.complete();
            return;
        }
        /**正在显示完整信息, 直接显示下一条*/
        if (step_info.in_wait) {
            this.showTip(++step_info.step);
            return;
        }
        /**显示当前信息的完整信息  */
        this.showTip(step_info.step);
    }
    /**获取当前提示信息的信息 */
    private getCurTipCompleteStepInfo() {
        let step = this.step
        let step_map = this.step_map;

        let step_t = 0, in_wait = false, is_complete = false;
        for (let i = 0, len = step_map.length; i < len; i++) {
            step_t += step_map[i];
            if (step < step_t) {
                step = step_t;
                break;
            }
            /**step == step_t是已经显示完整信息, 等待下一条信息 */
            if (step == step_t) {
                in_wait = true;
                /**如果是最后一条信息等待就是到了最后一条.. */
                if (i == len - 1) {
                    is_complete = true;
                }
                break;
            }
        }
        return {
            /**要进入的步骤*/
            step: step,
            /**是否已经显示完整信息, 是否正在等待下一条信息*/
            in_wait: in_wait,
            /**是否已经显示所有信息*/
            is_complete: is_complete
        }
    }
    /**显示结束,最终结果 */
    private complete() {
        if (this.complete_callback) {
            callFunc(this.complete_callback);
        }
        if (this.auto_hide) {
            this.hide();
        }
        this.reset();
    }

    /**重置 */
    private reset() {
        this.tip_msg = null;
        this.complete_callback = null;
        this.auto_hide = true;
        /**记录当前显示的位置 */
        this.step = -1;
        /**记录当前显示的位置 */
        this.step_map = null;
        this.isTiping = false;
    }
    hide() {
        this.link.html_div.innerHTML = '';
        this.view.visible = false;
    }
}
