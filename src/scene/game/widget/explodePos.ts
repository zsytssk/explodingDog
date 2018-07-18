import { BaseCtrl } from "../../../mcTree/ctrl/base";
import { log } from "../../../mcTree/utils/zutil";
import { CMD } from "../../../data/cmd";

export class ExplodePosCtrl {
    private view: ui.game.widget.setExplordeUI;
    private lastSelection: Laya.Button;
    public name = 'explode_pos_ctrl';
    constructor(view: ui.game.widget.setExplordeUI) {
        this.view = view;
        this.init();
    }
    init() {
        const { btnList, btnSelect } = this.view;
        btnList.array = [{ label: '第一张', value: 1 },
        { label: '第二张', value: 2 },
        { label: '第三张', value: 3 },
        { label: '第四张', value: 4 },
        { label: '第五张', value: 5 },
        { label: '卡堆最后一张', value: -1 },
        { label: '随机', value: -2 }
        ];
        btnList.selectHandler = new Laya.Handler(this, index => {
            const selection = btnList.selection as Laya.Button;
            selection.selected = true;
            if (this.lastSelection) {
                this.lastSelection.selected = false;
            }
            this.lastSelection = selection;
        });
        btnList.selectEnable = true;
        //选择按钮事件
        btnSelect.on(Laya.Event.CLICK, this, () => {
            if (btnList.selectedIndex != -1) {
                let explodingPos = btnList.selectedItem.value;
                Sail.io.emit(CMD.HIT, {
                    hitCard: 3101,
                    hitParams: { explodingPos }
                })
            }
        });
    }
    public show() {
        this.view.visible = true;
    }
}