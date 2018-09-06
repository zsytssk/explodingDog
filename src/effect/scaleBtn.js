import { getSoundPath } from "../utils/tool";

function createClass(SuperClass) {
    return class extends SuperClass {
        constructor() {
            super();
            this.init();
        }
        init() {
            // this.on(Laya.Event.MOUSE_DOWN, this, () => {
            //     this.scale(0.9, 0.9);
            //     Laya.SoundManager.playSound(getSoundPath('click_btn'));
            // });
            // this.on(Laya.Event.MOUSE_OUT, this, () => {
            //     this.scale(1, 1);
            // });
            // this.on(Laya.Event.MOUSE_UP, this, () => {
            //     this.scale(1, 1);
            // });
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                Laya.Tween.to(this, { scaleX: 0.9, scaleY: 0.9 }, 50, null, new Laya.Handler(this, () => {
                    Laya.SoundManager.playSound(getSoundPath('click_btn'));
                    Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 50);
                }));
            });
        }
    }
}

Sail.class(createClass(Laya.Box), "Component.ScaleBox");
Sail.class(createClass(Laya.Image), "Component.ScaleImg");
Sail.class(createClass(Laya.Button), "Component.ScaleBtn");
