import { isFunc } from '../../utils/other';
import { zutil } from '../../utils/zutil';

import { BaseCtrl } from '../component/base';
import { NodeCtrl } from '../component/node';
import { AppCtrl } from '../app';
import { PrimusCtrl, t_primus_event_handler } from '../network/primus';
import { AjaxCtrl } from '../network/ajax';
import { GuideCtrl } from './main';

export interface t_guideprocess_link {
    primus: PrimusCtrl;
    ajax: AjaxCtrl;
    guide: GuideCtrl;
}
type type_sub_process_item = GuideProcess | Function

export class GuideProcess extends NodeCtrl {
    protected link: t_guideprocess_link;
    private cur_index: number;
    protected _sub_process_list: type_sub_process_item[];
    public up_process: GuideProcess;
    private primusEventHandler: t_primus_event_handler;
    private off_primus_handler: Function;
    private ajaxEventHandler: t_primus_event_handler;
    private off_ajax_handler: Function;
    init(callback?) {
    }
    protected initLink() {
        let app = zutil.queryClosest(<BaseCtrl>this, 'name:app') as AppCtrl;
        let primus = zutil.getElementsByName(<BaseCtrl>app, 'primus')[0] as PrimusCtrl;
        let ajax = zutil.getElementsByName(<BaseCtrl>app, 'ajax')[0] as AjaxCtrl;
        let guide = zutil.queryClosest(<BaseCtrl>this, 'name:guide') as GuideCtrl;

        this.link.primus = primus;
        this.link.ajax = ajax;
        this.link.guide = guide;
    }
    protected bindPrimusEventHandler(fun: t_primus_event_handler) {
        let primus = this.link.primus;
        this.primusEventHandler = fun;
        this.off_primus_handler = primus.addEventHandler(this.mapPrimusData.bind(this));
    }
    protected offPrimusEventHandler(fun: t_primus_event_handler) {
        this.off_primus_handler();
    }
    private mapPrimusData(event: string, data?: any): boolean {
        let has_handler;
        if (!this.primusEventHandler) {
            return false;
        }
        has_handler = this.primusEventHandler(event, data);
        return has_handler ? true : false;
    }
    protected sendDataToPrimus(event: string, data?: any) {
        let primus = this.link.primus;
        primus.emitBackEvent(event, data);
    }
    protected bindAjaxEventHandler(fun: t_primus_event_handler) {
        let ajax = this.link.ajax;
        this.ajaxEventHandler = fun;
        this.off_ajax_handler = ajax.addEventHandler(this.mapAjaxData.bind(this));
    }
    protected offAjaxEventHandler(fun: t_primus_event_handler) {
        this.off_primus_handler();
    }
    private mapAjaxData(event: string, data?: any): boolean {
        let has_handler;
        if (!this.ajaxEventHandler) {
            return false;
        }
        has_handler = this.ajaxEventHandler(event, data);
        return has_handler ? true : false;
    }
    protected sendDataToAjax(event: string, data?: any) {
        let ajax = this.link.ajax;
        ajax.emitBackEvent(event, data);
    }
    public get sub_process_list() {
        return this._sub_process_list;
    }
    public set sub_process_list(list: type_sub_process_item[]) {
        this._sub_process_list = list;
        for (let i = 0; i < list.length; i++) {
            if (list[i] instanceof GuideProcess) {
                (<GuideProcess>list[i]).up_process = this;
            }
        }
    }
    public goto(path_list: string[]) {
        let process_list = this.sub_process_list;
        let index: number;
        let cur_process_path = path_list.shift();
        if (!this.sub_process_list) {
            zutil.log(`guide:: process->${this.name} don't have sub process!`);
            return;
        }
        /**如果是数字就表示是 sub_process_list中的第几个*/
        if (Number(cur_process_path) == Number(cur_process_path)) {
            index = Number(cur_process_path);
        } else {
            /**名字匹配 */
            let find_process = false;
            for (let i = 0; i < process_list.length; i++) {
                if ((<GuideProcess>process_list[i]).name == cur_process_path) {
                    find_process = true;
                    index = i;
                    break;
                }
            }
            if (!find_process) {
                zutil.log(`guide:: could't find process name euqal ${cur_process_path}`);
                return;
            }
        }

        /**
         * path_list已经为空表示已经到了目标process
         * 如果没有继续goto
         */
        let cur_process = process_list[index];
        if (!path_list.length) {
            /**GuideProcess  */
            if (cur_process instanceof GuideProcess) {
                cur_process.start();
            } else {
                /**function  */
                cur_process();
            }
        } else {
            if (!(cur_process instanceof GuideProcess)) {
                zutil.log('guide:: function is only use in end of path');
                return;
            }
            cur_process.start(() => {
                (<GuideProcess>cur_process).goto(path_list);
            });
        }
        this.cur_index = <number>index;
    }
    protected next() {
        if (!this.sub_process_list) {
            this.complete();
            return;
        }

        let index: Number;
        /** 如果process_list还没有运行*/
        if (this.cur_index === undefined) {
            index = 0;
        } else {
            index = this.cur_index + 1;
        }
        if (index >= this.sub_process_list.length) {
            this.complete();
            return;
        }

        this.goto([index.toString()]);
    }
    /**开始process
     * @param callback 用于goto跳转至其中特定的一步, 如果没有就跳到第一步
     */
    public start(callback?: Function) {
        zutil.log(`${this.name} process start`);

        if (isFunc(callback)) {
            callback();
            return;
        }
        let process_list = this.sub_process_list;
        if (!process_list) {
            return;
        }
        this.goto(['0']);
    }
    protected complete() {
        zutil.log(`${this.name} process completed`);
        if (this.up_process) {
            this.up_process.next();
        }
        this.destroy();
    }
    public destroy() {
        let off_primus_handler = this.off_primus_handler;
        let off_ajax_handler = this.off_ajax_handler;
        if (off_primus_handler) {
            off_primus_handler();
            this.off_primus_handler = null;
        }
        if (off_ajax_handler) {
            off_ajax_handler();
            this.off_ajax_handler = null;
        }
        super.destroy();
    }
}