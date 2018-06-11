import { HallCtrl } from "./hall/main";
import { NormalCtrl } from "./normal/main";
import { RoomCtrl } from "./room/main";
import { PopWrapCtrl } from "./pop/main";
import { GameNormalCtrl } from "./room/normal/game";
import { GamePokerCtrl } from "./room/poker/game";
import { RouterCtrl, RouterConfig } from "./network/router";
import { RoomRouterConfig } from "./room/routerConfig";
import { PopRouterConfig } from "./pop/routerConfig";

let root_config: RouterConfig = [
  {
    path: "hall",
    ctrl: HallCtrl
  },
  {
    path: "normal",
    ctrl: NormalCtrl
  },
  {
    path: "room",
    ctrl: RoomCtrl
  },
  {
    path: "[pop]",
    ctrl: PopWrapCtrl
  },
  { path: "default", redirectTo: "/hall" }
];

export class AppRouterConfig {
  configNode;
  constructor(router: RouterCtrl, path: string) {
    router.forRoot(root_config);
    new RoomRouterConfig(router, "room");
    new PopRouterConfig(router, "[pop]");
  }
  destroy() {
    this.configNode.destroy();
  }
}
