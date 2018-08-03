import { loadAssets } from "../loaing/main";
import { Hall } from "../hall/scene";
import { getChildren, log, getAllChildren } from "../../mcTree/utils/zutil";

export class GuideStep extends ui.guide.stepUI {
    constructor() {
        super();
        this.init();
    }
    private cards = getAllChildren(this.cardBox);
    init() {
        this.initEvent();
    }

    setStep(step) {
        this.tip.skin = `images/guide/text_help${step}.png`;
        switch (step) {
            case 1:
                break;
            default:
                break;
        }
    }

    initEvent() {
        const { btnSkip, discardZone, cardBox } = this;
        btnSkip.on(Laya.Event.CLICK, this, () => {
            loadAssets('hall').then(() => {
                Sail.director.runScene(new Hall());
            })
        });

        getChildren(cardBox).forEach((card, index) => {
            card.zOrder = card.index = index;
            card.on(Laya.Event.DRAG_END, this, () => {
                let disCardPoint = discardZone.localToGlobal(new Laya.Point(0.5 * discardZone.width, 0.5 * discardZone.height));
                if (Math.abs(card.x - disCardPoint.x) < 0.8 * discardZone.width
                    && Math.abs(card.y - disCardPoint.y) < 0.8 * discardZone.height) {
                    Laya.Tween.to(card, { x: disCardPoint.x, y: disCardPoint.y }, 100);
                } else {
                    this.moveCard(card.index, 1);
                    Laya.Tween.to(card, { x: card.originPoint.x, y: card.originPoint.y }, 100, null, new Laya.Handler(this, () => {
                        let point = cardBox.globalToLocal(new Laya.Point(card.x, card.y));
                        log(point)
                        card.pos(point.x, point.y);
                        cardBox.addChild(card);
                    }));
                }
            })
            card.on(Laya.Event.MOUSE_DOWN, this, () => {
                let point = card.originPoint = card.localToGlobal(new Laya.Point(0.5 * card.width, 0.5 * card.height));
                card.pos(point.x, point.y);
                Laya.stage.addChild(card);
                card.startDrag();
                this.moveCard(card.index, 0);
            })
        });

    }

    /**
     * 卡组横向移动
     * @param index 删除或增加的卡牌位置 
     * @param type 0:删除.1:增加
     */
    moveCard(index, type) {
        getChildren(this.cardBox).forEach(card => {
            if (card.index > index) {
                let targetX = type == 1 ? 160 * (card.index + 1) : 160 * card.index;
                Laya.Tween.to(card, { x: targetX }, 300);
            }
        })
    }
    destroy() {
        this.cards.forEach(card => {
            card.destroy();
        });
        super.destroy();
    }
}