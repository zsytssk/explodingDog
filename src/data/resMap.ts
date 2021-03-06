/**
 * 所有资源和相关的ctrl的对应列表, 在ctrl的ui初始化之前必须加载;
 * resource_status: loaded | unload | loading 资源的状态;
 * relevance 和当前的资源相关的资源, 用户可能下一步操作所需的资源;
 * 可以在当前资源加载完成之后在后台默默的加载, 具体的方法还没有想好;
 */
import { RES } from './res';
import { ResMap } from '../mcTree/utils/load';

export let RESMAP: ResMap = [
    {
        name: 'loading',
        res: RES.LOADING,
        res_dependencies: [],
        res_relatives: [],
        resource_status: 'unload',
    },
    {
        name: 'hall',
        res: RES.HALL,
        res_dependencies: [RES.COMPONENT, RES.POP],
        res_relatives: [],
        resource_status: 'unload',
    },
    {
        name: 'game',
        res: RES.GAME,
        res_dependencies: [RES.COMPONENT, RES.POP],
        res_relatives: [],
        resource_status: 'unload',
    },
    {
        name: 'guide',
        res: RES.GUIDE,
        res_dependencies: [RES.COMPONENT],
        res_relatives: [],
        resource_status: 'unload',
    },
];
