export class CardPack extends ui.popup.component.cardPackUI {
    constructor(data) {
        super();
        this.init(data);
    }
    /**
     * 
     * @param type 1.普通2.疯狂。乱舞isLock,cardType,staminaCost
     */
    init({ isLock, cardType, staminaCost }) {
        this.bg.skin = `images/cards/icon_card${cardType}.png`;
        this.chooseBtn.skin = isLock ? `images/cards/btn_lock.png` : `images/cards/btn_choose.png`;
        this.staminaLabl.chageText(`(         - ${Math.abs(staminaCost)} ) `);
    }
}