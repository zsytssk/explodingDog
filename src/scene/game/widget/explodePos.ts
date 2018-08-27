import { BaseCtrl } from "../../../mcTree/ctrl/base";
import { log, queryClosest } from "../../../mcTree/utils/zutil";
import { CMD } from "../../../data/cmd";
import { GameCtrl } from "../main";

export class ExplodePosCtrl extends BaseCtrl {
    private view: ui.game.widget.setExplordeUI;
    private lastSelection: Laya.Button;
    private timeout;
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
            this.lastSelection = selection;
        });
        //选择按钮事件
        btnSelect.on(Laya.Event.CLICK, this, this.emitData);
    }

    /**通过索引选中 */
    public selectByIndex(selectIndex:number){
        const { btnList } = this.view;
        btnList.cells.forEach((cell,index)=>{
            if(btnList.array[index].value == selectIndex){
                btnList.selection = cell;
            }
        })
    }

    private emitData() {
        const btnList = this.view.btnList;
        if (btnList.selectedItem) {
            let explodingPos = btnList.selectedItem.value;
            Sail.io.emit(CMD.HIT, {
                hitCard: 3101,
                hitParams: { explodingPos }
            })
        }
    }

    public showView(remainTime) {
        const game_ctrl = this.parent as GameCtrl;
        let remain = game_ctrl.getRemainCardNum();
        this.view.btnList.array = this.array1.slice(0, remain + 1).concat(this.array2);
        if (this.lastSelection) {
            this.lastSelection.selected = false;
            this.lastSelection = null;
        }
        this.view.visible = true;
        this.timeout = setTimeout(this.emitData.bind(this), remainTime - 3000);
    }
    public hideView() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.view.btnList.selectedIndex = -1;
        this.view.visible = false;
    }
}