import { BaseCtrl } from '../../../mcTree/ctrl/base';
import { CardModel } from '../model/card';
import { CurCardBoxCtrl } from './curCardBox';

export interface Link {
    view: Laya.Node;
}

/** 当前用户的牌 */
export class CurCardCtrl extends BaseCtrl {
    public parent: CurCardBoxCtrl;
    protected model: CardModel;
    protected link = {} as Link;
    constructor(model) {
        super();
        this.model = model;
    }
    public init() {
        this.initLink();
        this.initEvent();
    }
    protected initLink() {}
    protected initEvent() {}
    public loadModel() {}
}
