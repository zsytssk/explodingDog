import { t_sprite } from '../data/sprite';
import {
  createSprite,
  resumeAni,
  pauseAni,
  resetSprite
} from '../utils/other';

/**创建动画队列用于异步创建骨骼动画, 这样不会同时创建多个骨骼动画造成峰值*/
export type t_ani = laya.ani.bone.Skeleton | laya.display.Animation;
type t_ani_que_item = {
  /**动画类型*/
  ani_type: t_sprite;
  /**动画等级*/
  ani_level: number | string;
  /**动画返回函数*/
  callback: (view: Laya.Sprite) => void;
}
class AniFactory {
  _ani_pool: Laya.Sprite[] = [];

  /**将动画添加到加载队列中*/
  add(ani_type: t_sprite, ani_level?: number | string) {
    let ani = this.checkPool(ani_type, ani_level);
    if (ani) {
      /**播放动画*/
      if (ani instanceof laya.display.Animation || ani instanceof laya.ani.bone.Skeleton) {
        resumeAni(ani);
      }
      return ani;
    }

    return createSprite(ani_type, ani_level);
  }

  restore(ani_type: t_sprite, ani_level: number | string, ani: Laya.Sprite) {
    /**还原可能出现hide动画导致属性变化 */
    resetSprite(ani);
    /**暂停动画播放*/
    if (ani instanceof laya.display.Animation || ani instanceof laya.ani.bone.Skeleton) {
      pauseAni(ani);
    }
    (<Laya_Sprite>ani).ani_type = ani_type;
    (<Laya_Sprite>ani).ani_level = ani_level;
    this._ani_pool.push(ani);
  }
  checkPool(ani_type: t_sprite, ani_level: number | string): Laya.Sprite {
    for (let len = this._ani_pool.length, i = len - 1; i >= 0; i--) {
      let pool_item = this._ani_pool[i] as Laya_Sprite;
      if (pool_item.ani_type == ani_type && pool_item.ani_level == ani_level) {
        let ani = this._ani_pool.splice(i, 1)[0];
        return ani;
      }
    }
    return null;
  }
}
export let aniFactory = new AniFactory();