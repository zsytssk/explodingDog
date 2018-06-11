import { RouterConfig, RouterCtrl } from './network/router';
import { HallCtrl } from './scene/hall/main';

const root_config: RouterConfig = [
    {
        path: 'hall',
        ctrl: HallCtrl,
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
