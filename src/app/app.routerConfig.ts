import { RouterConfig, RouterCtrl } from './network/router';
import { HallCtrl } from './scene/hall/main';
import { LoadCtrl } from './scene/load';

const root_config: RouterConfig = [
    {
        path: 'hall',
        ctrl: HallCtrl,
    },
    {
        path: 'load',
        ctrl: LoadCtrl,
    },
    { path: 'default', redirectTo: '/hall' },
];

export class AppRouterConfig {
    private configNode;
    constructor(router: RouterCtrl, path: string) {
        router.forRoot(root_config);
    }
    public destroy() {
        this.configNode.destroy();
    }
}
