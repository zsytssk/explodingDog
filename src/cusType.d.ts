type FuncVoid = () => void;
type FuncListener = (data: t_any_obj) => void;
type t_any_obj = { [x: string]: any };

type t_resource_status = 'loaded' | 'unload' | 'loading';
type ResMap = {
    name: string;
    res: any;
    res_dependencies?: any[]; // 依赖资源
    resource_status: t_resource_status;
    res_relatives?: any[];
    order?: number;
}[];

type t_point = {
    x: number;
    y: number;
};
