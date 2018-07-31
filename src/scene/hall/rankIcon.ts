import { log } from "../../mcTree/utils/zutil";

const topList = {
    3: [15, 0, 15],
    4: [15, 0, 0, 15],
    5: [20, 5, 0, 5, 20]
}

export class rankIcon extends Laya.Box {
    iconClip: Laya.Clip;//段位图标
    levelClip: Laya.Clip;//等级图标
    starBox: Laya.Box//星星图标容器
    constructor(rank) {
        super();
        this.init(rank);
    }
    init(rank) {
        let icon = 0;//段位
        let level = 0;//级别
        let levelCount;
        if (rank < 16) {//青铜、白银、黄金各有5级
            icon = Math.ceil(rank / 5) - 1;
            level = (rank - 1) % 5;
            levelCount = 5;
        } else if (rank < 20) {//钻石有4级
            icon = 3;
            level = rank - 16;
            levelCount = 4;
        } else {//王者有3级
            icon = 4;
            level = rank - 20;
            levelCount = 3;
        }
        let starBox = new Laya.Box();
        starBox.size(95, 45);
        starBox.x = 15;

        let iconClip = this.iconClip = new Laya.Clip('images/component/clip_rank.png', 5);
        iconClip.index = icon;
        iconClip.top = 25;

        let levelClip = this.levelClip = new Laya.Clip(`images/component/clip_level${icon}.png`, levelCount);
        levelClip.index = level;
        levelClip.pos(25, 60);

        for (let i = 0; i < levelCount; i++) {
            let star = new Laya.Clip('images/component/clip_star.png', 2);
            star.anchorX = 0.5;
            star.x = starBox.width / (levelCount - 1) * i;
            star.top = topList[levelCount][i];
            if (i <= level) {
                star.index = 1;
            }
            starBox.addChild(star);
        }
        this.addChildren(iconClip, levelClip, starBox);
    }
}