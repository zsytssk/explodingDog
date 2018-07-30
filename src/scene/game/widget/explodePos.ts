import { BaseCtrl } from "../../../mcTree/ctrl/base";
import { log, queryClosest } from "../../../mcTree/utils/zutil";
import { CMD } from "../../../data/cmd";
import { GameCtrl } from "../main";

export class ExplodePosCtrl extends BaseCtrl {
    private view: ui.game.widget.setExplordeUI;
    private lastSelection: Laya.Button;
    public name = 'explode_pos_ctrl';
    private array1 = [
        { label: '第一张', value: 1 },
        { label: '第二张', value: 2 },
        { label: '第三张', value: 3 },
        { label: '第四张', value: 4 },
        { label: '第五张', value: 5 }
    ];
    private array2 = [
        { label: '卡堆最后一张', value: -1 },
        { label: '随机', value: -2 }
    ];
    constructor(view: ui.game.widget.setExplordeUI) {
        super();
        this.view = view;
        this.init();
    }
    init() {
        const { btnList, btnSelect } = this.view;
        // btnList.array = [{ label: '第一张', value: 1 },
        // { label: '第二张', value: 2 },
        // { label: '第三张', value: 3 },
        // { label: '第四张', value: 4 },
        // { label: '第五张', value: 5 },
        // { label: '卡堆最后一张', value: -1 },
        // { label: '随机', value: -2 }
        // ];
        btnList.selectEnable = true;
        btnList.selectHandler = new Laya.Handler(this, index => {
            if (this.lastSelection) {
                this.lastSelection.selected = false;
            }
            if (index < 0) {
                return;
            }
            let selection = btnList.selection as Laya.Button;
            selection.selected = true;
            log(this.lastSelection)
            this.lastSelection = selection;
        });
        //选择按钮事件
        btnSelect.on(Laya.Event.CLICK, this, () => {
            if (btnList.selectedItem) {
                let explodingPos = btnList.selectedItem.value;
                Sail.io.emit(CMD.HIT, {
                    hitCard: 3101,
                    hitParams: { explodingPos }
                })
            }
        });
    }
    public showView() {
        const game_ctrl = this.parent as GameCtrl;
        let remain = game_ctrl.getRemainCardNum();
        this.view.btnList.array = this.array1.slice(0, remain + 1).concat(this.array2);
        if (this.lastSelection) {
            this.lastSelection.selected = false;
            this.lastSelection = null;
        }
        this.view.visible = true;
    }
    public hideView() {
        this.view.btnList.selectedIndex = -1;
        this.view.visible = false;
    }
}