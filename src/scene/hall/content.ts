export class HallContent extends ui.hall.hallcontentUI {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.expBar.bar.y = 2;
        this.initEvent();
    }
    initEvent() {
        this.btnPlay.on(Laya.Event.CLICK, this, () => {
            console.log(111111);
        });
    }
    updateView(data) {
        this.userName.changeText(data.nickname);
        this.level.changeText(`Lv：${data.level}`);
        this.totalRound.changeText(`场次：${data.totalPlayCount}`);
        this.winrate.changeText(`胜率:${data.winRate}%`);
        this.score.changeText(`积分：${data.score}`);
        this.expBar.value = data.currentExp / data.nextLevelExp;
    }
}
