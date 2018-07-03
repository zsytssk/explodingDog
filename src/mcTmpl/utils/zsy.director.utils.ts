export function routerUrlToObj(test_str) {
    test_str = test_str.replace('#', '');
    let param = analysisParam(test_str);
    let outset = getOutset(test_str);
    let path = getPath(test_str);

    let router = {
        path: path,
        outset: outset,
        param: param
    };

    return router
}
function getOutset(path) {
    let match_rex = /\(([^\)].+)\)/g;
    let match = match_rex.exec(path);
    if (match) {
        return queryStr(match[1]);
    }
    return;
}
function getPath(path) {
    let match_rex = /^([^;\(\)])+/g;
    let match = path.match(match_rex);
    match = match ? match[0] : undefined;
    return match;
}
function analysisParam(test_str) {
    let match_rex = /;([^\(\)]+)/g;
    let match = match_rex.exec(test_str);
    if (match) {
        let match_str = match[1];
        return queryStr(match_str);
    }
    return;
}
function queryStr(test_str) {
    let param_arr = test_str.split(';');
    let param = {};
    for (var i = 0; i < param_arr.length; i++) {
        if (!param_arr[i]) {
            continue;
        }
        var pair = param_arr[i].split("=");
        if (typeof param[pair[0]] === "undefined") {
            param[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof param[pair[0]] === "string") {
            var arr = [param[pair[0]], decodeURIComponent(pair[1])];
            param[pair[0]] = arr;
        } else {
            param[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return param;
}
export function routerObjToUrl(router_info) {
    let path_str = router_info.path;
    let outset_str = '';
    let outset = router_info.outset;
    for (let key in outset) {
        outset_str += key + '=' + outset[key] + ';'
    }
    if (outset_str) {
        outset_str = `(${outset_str})`;
    }

    let param_str = '';
    let param = router_info.param;
    for (let key in param) {
        param_str += ';' + key + '=' + param[key]
    }

    return path_str + outset_str + param_str;
}
export type Change_Item = {
    key: string;
    type: 'delete' | 'add' | 'modified';
    ori_val?: any;
    end_val?: any;
}
type Change_Arr = Change_Item[];
/**
 * 对比两个对象, 最后变成这个形式
  {key: "outset:popup", type: "modified", ori_val: "alert/tip", end_val: "alertq/tip"}
  {key: "param:foo", type: "delete", ori_val: "1"}
  {key: "param:boo", type: "delete", ori_val: "2"}
  {key: "param:fod", type: "add", end_value: "2"}
 * @param ori_obj 原始对象
 * @param com_obj 对比对象
 * @param parent_key 递归比较时两个的递归的key p1_key:p2_key:..
 */
export function compareObj(ori_obj, com_obj, parent_key?): Change_Arr {
    let change_arr = [] as Change_Arr;
    ori_obj = ori_obj || {};
    com_obj = com_obj || {};
    for (let o_key in ori_obj) {
        let ori_item = ori_obj[o_key];
        let com_item = com_obj[o_key];

        let o_p_key = parent_key ? parent_key + ':' + o_key : o_key;
        if (!com_obj.hasOwnProperty(o_key)) {
            change_arr.push({
                key: o_p_key,
                type: 'delete',
                ori_val: ori_item
            });
            continue;
        }

        /**基本类型直接对比 */
        if (isPrim(ori_obj[o_key]) && isPrim(com_obj[o_key])) {
            if (ori_item != com_item) {
                change_arr.push({
                    key: o_p_key,
                    type: 'modified',
                    ori_val: ori_item,
                    end_val: com_item
                });
                continue;
            }
            if (ori_item == com_item) {
                continue;
            }
        }

        /**复杂类型 递归对比 */
        let change_item_arr = compareObj(ori_item, com_item, o_p_key);
        change_arr = change_arr.concat(change_item_arr);
    }

    /**查找增加的 */
    for (let c_key in com_obj) {
        let ori_item = ori_obj[c_key];
        let com_item = com_obj[c_key];

        let o_p_key = parent_key ? parent_key + ':' + c_key : c_key;
        if (!ori_obj.hasOwnProperty(c_key)) {
            change_arr.push({
                key: o_p_key,
                type: 'add',
                end_val: com_obj[c_key]
            });
            continue;
        }
    }
    return change_arr;
}
/**比较两个对象是否相等 */
export function isEqualObj(ori_obj, com_obj) {
    ori_obj = ori_obj || {};
    com_obj = com_obj || {};
    for (let o_key in ori_obj) {
        let ori_item = ori_obj[o_key];
        let com_item = com_obj[o_key];

        if (!com_obj.hasOwnProperty(o_key)) {
            return false;
        }

        /**基本类型直接对比 */
        if (isPrim(ori_obj[o_key])) {
            if (ori_item != com_item) {
                return false;
            }
            if (ori_item == com_item) {
                continue;
            }
        }


        /**复杂类型 递归对比 */
        let item_equal = isEqualObj(ori_item, com_item);
        if (!item_equal) {
            return false;
        }
    }

    /**查找增加的 */
    for (let c_key in com_obj) {
        if (!ori_obj.hasOwnProperty(c_key)) {
            return false;
        }
    }
    return true;
}
/**原始类型, null 没有做处理*/
function isPrim(value) {
    let value_type = typeof value;
    return value_type != 'function' && value_type != 'object';
}