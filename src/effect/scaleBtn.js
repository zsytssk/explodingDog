function createClass(SuperClass) {
    return class extends SuperClass {
        constructor() {
            super();
            this.init();
        }
        init() {
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.scale(0.9, 0.9);
            });
            this.on(Laya.Event.MOUSE_OUT, this, () => {
                this.scale(1, 1);
            });
            this.on(Laya.Event.MOUSE_UP, this, () => {
                this.scale(1, 1);
            });
        }
    }
}

Sail.class(createClass(Laya.Box), "Component.ScaleBox");
Sail.class(createClass(Laya.Image), "Component.ScaleImg");
Sail.class(createClass(Laya.Button), "Component.ScaleBtn");
