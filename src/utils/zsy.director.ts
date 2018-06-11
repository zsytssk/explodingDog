import { routerUrlToObj, routerObjToUrl, compareObj, isEqualObj, Change_Item } from './zsy.director.utils'
import { zutil } from './zutil';

type UrlInfo = {
  path?: string;
  outset?: {
    [key: string]: string
  },
  param?: {
    [key: string]: string
  }
}
export type Director_Change_Info = {
  type: UrlChangeType,
  key?: string;
  ori_val?: string,
  end_val?: string
}

export type set_path_info = {
  type: UrlChangeType;
  /**outset改变的name*/
  outset_name?: string;
  /**outset改变的key name*/
  param_name?: string;
  value: any;
}
/**路径变化的类型*/
export type UrlChangeType = 'path' | 'outset' | 'param';
/**路径变化的信息 */
type UrlChangeInfo = {
  type: UrlChangeType;
  /**变化之前的路径 */
  before_path: string;
  /**变化之后的路径 */
  after_path: string;
  /**如果是outset变化outset的名次 */
  outset?: string;
}

/** 路由控制 */
export class zsyDirector {
  mode: 'history' | 'hash' = 'hash';
  root = '/';
  interval = null;
  on_change_before_fns = [] as Function[];
  /**当前页面所在的地址*/
  cur_router: UrlInfo = {
    outset: undefined,
    param: undefined
  };
  constructor(options) {
    this.initConfig(options);
  }
  private initConfig(options) {
    this.mode = options && options.mode && options.mode == 'history' &&
      !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? '/' + this.clearPath(options.root) + '/' : '/';
    return this;
  }
  /** 获得当前的页面地址 */
  public getUrl() {
    let path = '';
    let match = window.location.href.match(/#(.*)$/);
    path = match ? match[1] : '';
    path = this.clearPath(path);

    return routerUrlToObj(path);
  }
  private clearPath(path) {
    return path.toString().replace(/\/{2,}/g, '/');
  }
  private getFullPath(path) {
    return location.href.replace(location.origin, '').replace(location.pathname, path);
  }
  public listen() {
    if (this.mode === 'history') {
      window.addEventListener('popstate', (e) => {
        this.check();
      });
    } else {
      clearInterval(this.interval);
      this.interval = window.setInterval(this.check.bind(this), 100);
    }
    this.check();
    return;
  }
  private check() {
    let cur_url_info = this.getUrl();
    let current = this.cur_router;

    let change_arr = compareObj(current, cur_url_info);
    /**没有改变 */
    if (!change_arr.length) {
      return;
    }

    let cur_router = this.cur_router;
    let fn_len = this.on_change_before_fns.length;

    this.on_change_before_fns.forEach((fun, i) => {
      if (!fun && typeof (fun) != 'function') {
        return true;
      }
      for (let j = 0; j < change_arr.length; j++) {
        window.setTimeout(() => {
          this.runChangeFun(fun, change_arr[j]);
        }, 0);
      }
      if (i == fn_len - 1) {
        this.cur_router = cur_url_info;
      }
    });
    return;
  }
  private runChangeFun(fun: Function, change_item: Change_Item) {
    let change_info = {} as Director_Change_Info;
    if (change_item.key == 'path') {
      change_info = {
        type: 'path',
        ori_val: change_item.ori_val,
        end_val: change_item.end_val,
      };
    }
    if (change_item.key.indexOf('outset') != -1) {
      change_info = {
        type: 'outset',
        key: change_item.key.replace(/outset(:)*/g, ''),
        ori_val: change_item.ori_val,
        end_val: change_item.end_val,
      };
    }
    if (change_item.key.indexOf('param') != -1) {
      change_info = {
        type: 'param',
        key: change_item.key.replace(/param(:)*/g, ''),
        ori_val: change_item.ori_val,
        end_val: change_item.end_val,
      };
    }
    fun(change_info);
  }
  public onChangeBefore(fun: Function) {
    if (!fun || typeof fun != 'function') {
      return;
    }
    this.on_change_before_fns.push(fun);
  }
  /** 设置当前的页面地址
   * @param replace_state  是否覆盖前一个历史
   * 地址没有意义 跳入default, 这时候 前一个地址还在历史中,
   * 点击后退 还是进入default 原页面
  */
  public navigate(path_info: set_path_info, replace_state: boolean) {
    let type = path_info.type;
    let url_info = this.getUrl();

    switch (type) {
      case 'path':
        url_info['path'] = path_info.value;
        break;
      case 'outset':
        let outset_name = path_info.outset_name;
        if (outset_name) {
          url_info['outset'] = url_info['outset'] || {};
          url_info['outset'][outset_name] = path_info.value;
        } else {
          url_info['outset'] = path_info.value;
        }
        break;
      case 'param':
        let param_name = path_info.param_name;
        if (param_name) {
          url_info['param'] = url_info['param'] || {};
          url_info['param'][param_name] = path_info.value;
        } else {
          url_info['param'] = path_info.value;
        }
        break;
      default:
        break;
    }

    let router_str = routerObjToUrl(url_info);
    router_str = this.clearPath('#/' + router_str);

    if (this.mode === 'history') {
      let base_url = location.pathname + location.search + this.clearPath(router_str);
      /**如果是 默认跳转说明前一个地址没有意义直接覆盖 前一个历史*/
      zutil.log('history_change', base_url);
      if (replace_state) {
        history.replaceState(null, null, base_url);
      } else {
        history.pushState(null, null, base_url);
      }
      this.check();
    } else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + router_str;
    }
  }
}
