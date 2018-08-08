import { loadAssets } from "../loading/main";
import { Hall } from "../hall/scene";
import { getChildren, log, getAllChildren, getChildrenByName, getElementsByName } from "../../mcTree/utils/zutil";
import { tween, stopAni, fade_out, fade_in } from "../../mcTree/utils/animate";
import { CMD } from "../../data/cmd";
import { CardIntroCtrl } from "../component/cardIntro";

export class GuideStep extends ui.guide.stepUI {
    public FINISH = 'finish';
    private handAni = new Laya.Skeleton();
    private successAni = new Laya.Skeleton();
    constructor() {
        super();
        this.init();
    }
    private cards = getAllChildren(this.cardBox);
    init() {
        this.handAni.load('animation/shouzhi.sk', );
        this.handAni.visible = false;
        this.successAni.load('animation/guide_success.sk')
        this.successAni.visible = false;
        this.successAni.pos(667, 335);
        this.addChildren(this.handAni, this.successAni);
        this.initEvent();
    }

    setStep(step) {
        const { tip, tipImg, discardZone } = this;
        tip.skin = `images/guide/text_help${step}.png`;
        switch (step) {
            case 1:
                tipImg.visible = false;
                discardZone.visible = false;
                this.timerLoop(3000, this, this.showHandClick);
                this.enableCardClick();
                break;
            case 2:
                discardZone.visible = true;
                this.timerLoop(3000, this, this.showHandDiscard);
                this.enableCardMove();
                break;
            case 3:
                tipImg.visible = true;
                this.timerLoop(3000, this, this.showDrawCard);
                this.enableDrawCard();
            default:
                break;
        }
    }

    initEvent() {
        const { btnSkip, discardZone, cardBox } = this;
        btnSkip.on(Laya.Event.CLICK, this, () => {
            Sail.io.emit(CMD.FINISH_GUIDE);
            loadAssets('hall').then(() => {
                Sail.director.runScene(new Hall());
            })
        });
    }

    setIndex(step) {
        getElementsByName(this, 'stepIndex').forEach((box, index) => {
            if (index < step) {
                box.getChildByName('icon').index = 1;
                box.getChildByName('label').color = '#9dd345';
            } else {
                box.getChildByName('icon').index = 0;
                box.getChildByName('label').color = '#FFFFFF';
            }
        });
    }
    //指示抓牌动画
    showDrawCard() {
        let handAni = this.handAni;
        handAni.pos(350, 300);
        handAni.visible = true;
        handAni.alpha = 1;
        handAni.once(Laya.Event.STOPPED, this, () => {
            handAni.play('wait', false);
            tween({
                sprite: handAni,
                start_props: { x: 350, y: 300, alpha: 1 },
                end_props: { x: 600, y: 650 },
                time: 800
            }).then(() => {
                handAni.play('pop', false);
                tween({
                    sprite: handAni,
                    end_props: { alpha: 0 },
                    time: 800
                })
            });
        });
        handAni.play('push', false);
    }
    //手指点击动画
    showHandClick() {
        let handAni = this.handAni;
        handAni.visible = true;
        handAni.play('wait', false);
        tween({
            sprite: handAni,
            start_props: { x: 1200, y: 700, alpha: 0 },
            end_props: { x: 700, y: 650, alpha: 1 },
            time: 800
        }).then(() => {
            handAni.play('click', false);
        });
    }
    //指示出牌动画
    showHandDiscard() {
        let handAni = this.handAni;
        handAni.pos(700, 650);
        handAni.visible = true;
        handAni.alpha = 1;
        handAni.once(Laya.Event.STOPPED, this, () => {
            handAni.play('wait', false);
            tween({
                sprite: handAni,
                start_props: { x: 700, y: 650, alpha: 1 },
                end_props: { x: 900, y: 350 },
                time: 800
            }).then(() => {
                handAni.play('pop', false);
                tween({
                    sprite: handAni,
                    end_props: { alpha: 0 },
                    time: 800
                })
            });
        });
        handAni.play('push', false);
    }

    enableCardClick() {
        const { cardBox, successAni, handAni } = this;
        const cardId = ['4201', '3321', '3601', '3201'];
        getChildren(cardBox).forEach((card, index) => {
            card.on(Laya.Event.CLICK, this, () => {
                let intro = new CardIntroCtrl(cardId[index], card);
                intro.init();
                intro.setStyle({ y: -260 });
                intro.show();
                successAni.visible = true;
                successAni.play(0, false);
                this.setIndex(1);
                this.clearTimer(this, this.showHandClick);
                handAni.visible = false;
                getChildren(cardBox).forEach(card => {
                    card.offAll();
                });
                this.timerOnce(2000, this, () => {
                    intro.destroy();
                    fade_out(this).then(() => {
                        this.setStep(2);
                        fade_in(this);
                    });
                });
            });
        });
    }

    enableCardMove() {
        const { discardZone, cardBox } = this;
        getChildren(cardBox).forEach((card, index) => {
            card.zOrder = card.index = index;
            card.on(Laya.Event.DRAG_END, this, () => {
                let disCardPoint = discardZone.localToGlobal(new Laya.Point(0.5 * discardZone.width, 0.5 * discardZone.height));
                if (Math.abs(card.x - disCardPoint.x) < 0.8 * discardZone.width
                    && Math.abs(card.y - disCardPoint.y) < 0.8 * discardZone.height) {
                    //出牌成功
                    Laya.Tween.to(card, { x: disCardPoint.x, y: disCardPoint.y }, 100);
                    this.cards.forEach(card => {
                        card.offAll();
                    });
                    this.successAni.visible = true;
                    this.successAni.play(0, false);
                    this.setIndex(2);
                    this.clearTimer(this, this.showHandDiscard);
                    this.handAni.visible = false;
                    // stopAni(this.handAni);
                    this.timerOnce(2000, this, () => {
                        fade_out(this).then(() => {
                            card.destroy();
                            this.setStep(3);
                            fade_in(this);
                        });
                    });
                } else {
                    this.moveCard(card.index, 1);
                    Laya.Tween.to(card, { x: card.originPoint.x, y: card.originPoint.y }, 100, null, new Laya.Handler(this, () => {
                        let point = cardBox.globalToLocal(new Laya.Point(card.x, card.y));
                        card.pos(point.x, point.y);
                        cardBox.addChild(card);
                    }));
                }
            });
            card.on(Laya.Event.DRAG_START, this, () => {
                let point = card.originPoint = card.localToGlobal(new Laya.Point(0.5 * card.width, 0.5 * card.height));
                card.pos(point.x, point.y);
                Laya.stage.addChild(card);
                this.moveCard(card.index, 0);
            });
            card.on(Laya.Event.MOUSE_DOWN, this, () => {
                card.startDrag();
            });
        });
    }

    enableDrawCard() {
        const { drawCard, cardBox, cardbacks } = this;
        drawCard.on(Laya.Event.MOUSE_DOWN, this, () => {
            let point = drawCard.originPoint = drawCard.localToGlobal(new Laya.Point(0.5 * drawCard.width, 0.5 * drawCard.height));
            drawCard.pos(point.x, point.y);
            Laya.stage.addChild(drawCard);
            drawCard.startDrag();
        });
        drawCard.on(Laya.Event.DRAG_END, this, () => {
            //成功抓牌
            let cardBoxPoint = cardBox.localToGlobal(new Laya.Point(0, 0));
            if (drawCard.x > cardBoxPoint.x - 100 && drawCard.y > cardBoxPoint.y - 100) {
                let index = Math.floor((Math.abs(drawCard.x - cardBoxPoint.x)) / 270);
                drawCard.skin = 'images/component/card/defuse.png';
                Laya.Tween.to(drawCard, {
                    x: cardBoxPoint.x + 140 + index * 160,
                    y: cardBoxPoint.y + 135
                }, 100);
                this.moveCard(index, 1);
                this.successAni.visible = true;
                this.successAni.play(0, false);
                this.setIndex(3);
                this.timerOnce(2000, this, () => {
                    drawCard.destroy();
                    this.event(this.FINISH);
                });
            } else {
                Laya.Tween.to(drawCard, { x: drawCard.originPoint.x, y: drawCard.originPoint.y }, 100, null, new Laya.Handler(this, () => {
                    let point = cardbacks.globalToLocal(new Laya.Point(drawCard.x, drawCard.y));
                    drawCard.pos(point.x, point.y);
                    cardbacks.addChild(drawCard);
                }));
            }
        });
    }

    /**
     * 卡组横向移动
     * @param index 删除或增加的卡牌位置
     * @param type 0:删除.1:增加
     */
    moveCard(index, type) {
        getChildren(this.cardBox).forEach(card => {
            if (type == 0 && card.index > index) {
                card.index -= 1;
                Laya.Tween.to(card, { x: 140 + 160 * card.index }, 300);
            } else if (type == 1 && card.index + 1 > index) {
                card.index += 1;
                Laya.Tween.to(card, { x: 140 + 160 * card.index }, 300);
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