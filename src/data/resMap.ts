/**
 * 所有资源和相关的ctrl的对应列表, 在ctrl的ui初始化之前必须加载;
 * resource_status: loaded | unload | loading 资源的状态;
 * relevance 和当前的资源相关的资源, 用户可能下一步操作所需的资源;
 * 可以在当前资源加载完成之后在后台默默的加载, 具体的方法还没有想好;
 */
import { RES } from './res';
import { ResMap } from '../mcTmpl/utils/load';

export let RESMAP: ResMap = [
    {
        name: 'normal',
        res: RES.GAME,
        res_dependencies: [RES.COMPONENT], // 依赖资源
        res_relatives: [],
        resource_status: 'unload',
    },
];
