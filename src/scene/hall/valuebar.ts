export class ValueBar extends ui.hall.valuebarUI {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.richText.style.fontSize = 30;
        this.richText.style.align = 'center';
        this.richText.style.bold = true;
        this.richText.style.fontFamily = 'simhei';
        // this.richText.innerHTML = `<span color="red">0</span><span color="white">/20</span>`;
    }
    setType(type) {
        this.type = type;
        this.icon.skin = `images/hall/icon_${type}.png`;
    }
    setValue(data) {
        if (!Array.isArray(data)) {
            return;
        }
        if (data.length == 1) {
            this.richText.innerHTML = `<span color="white">${data[0]}</span>`;
        } else {
            let fontcolor = data[0] > data[1] ? 'red' : 'white';
            this.richText.innerHTML = `<span color="${fontcolor}">${
                data[0]
            }</span><span color="white">/${data[1]}</span>`;
        }
    }
}

Sail.class(ValueBar, 'Component.valueBar');
