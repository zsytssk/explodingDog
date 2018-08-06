import { convertXMLToNode } from '../../../mcTree/utils/zutil';
import { setStyle } from '../../../mcTree/utils/animate';

const pool = [] as Laya.Sprite[];
// tslint:disable-next-line:max-line-length
const card_back_xml = `<Image x="0" width="264" skin="images/component/card/card_back.png" height="273" editorInfo="compId=4"/>`;
export function create(): Laya.Sprite {
    if (pool.length) {
        return pool.pop();
    }
    return convertXMLToNode(card_back_xml);
}
export function restore(card_back: Laya.Sprite) {
    pool.push(card_back);
    card_back.parent.removeChild(card_back);
    setStyle(card_back, {
        x: 0,
        y: 0,
    });
}
export function calcCreate(card_heap: Laya.Sprite, num) {
    if (num > 0) {
        for (let i = 0; i < num; i++) {
            card_heap.addChild(create());
        }
        return;
    }
    num = Math.abs(num);
    for (let i = num - 1; i >= 0; i--) {
        restore(card_heap.getChildAt(i) as Laya.Sprite);
    }
}
