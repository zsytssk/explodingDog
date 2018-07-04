import * as isNaN from 'lodash/isNaN';
export function fade_in(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    let Tween = new Laya.Tween();
    let Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 700 : time;

    let time_fn: Function = time_name ? Ease[time_name] : Ease['circleOut'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    /*
      如果sprite为正常显示的, 这时候就没有必要fadeIn了, 只有在不显示或者透敏度
      不为1时候才有意义, 就像其他的一样
    */
    if (sprite.visible === false) {
        sprite.alpha = 0;
        sprite.visible = true;
    }

    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 1,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function fade_out(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    let Tween = new Laya.Tween();
    let Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 700 : time;

    let time_fn: Function = time_name ? Ease[time_name] : Ease['circleIn'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }

    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 0,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            sprite.visible = false;
            // sprite.alpha = 1;
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function scale_in(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    let Tween = new Laya.Tween();
    let Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 800 : time;

    let time_fn: Function = time_name ? Ease[time_name] : Ease['backOut'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }

    sprite.alpha = 0.2;
    sprite.scale(0.2, 0.2);
    sprite.visible = true;

    sprite.tween = Tween.to(
        sprite,
        {
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function scale_out(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    let Tween = new Laya.Tween();
    let Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 400 : time;

    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }

    let time_fn: Function = time_name ? Ease[time_name] : Ease['backIn'];
    sprite.tween = Tween.to(
        sprite,
        {
            scaleX: 0.2,
            scaleY: 0.2,
            alpha: 0.2,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            sprite.visible = false;
            sprite.scaleX = sprite.scaleY = sprite.alpha = 1;
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_up_in(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
    space?: number,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 200 : time;

    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;

    var height = sprite.getBounds().height;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleOut'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }

    var _y = sprite.y;

    height = space || (height > 50 ? 50 : height);
    sprite.alpha = 0;
    sprite.y = _y + height;
    sprite.visible = true;

    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 1,
            y: _y,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_up_out(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
    space?: number,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 200 : time;

    var height = sprite.getBounds().height;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleIn'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    var _y = sprite.y;

    height = space || (height > 50 ? 50 : height);
    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 0,
            y: _y - height,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            sprite.visible = false;
            sprite.alpha = 1;
            sprite.y = _y;
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_down_in(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
    space?: number,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 200 : time;

    var height = sprite.getBounds().height;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleOut'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    height = space || (height > 50 ? 50 : height);
    var _y = sprite.y;

    sprite.alpha = 0;
    sprite.y = _y - height;
    sprite.visible = true;

    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 1,
            y: _y,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_down_out(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
    space?: number,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 200 : time;

    var height = sprite.getBounds().height;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleIn'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    var _y = sprite.y;
    height = space || (height > 50 ? 50 : height);
    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 0,
            y: _y + height,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            sprite.visible = false;
            sprite.alpha = 1;
            sprite.y = _y;
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_left_in(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 200 : time;

    var width = sprite.getBounds().width;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleOut'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    width = width > 50 ? 50 : width;
    var _x = sprite.x;

    sprite.alpha = 0;
    sprite.x = _x + width;
    sprite.visible = true;

    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 1,
            x: _x,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_left_out(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 200 : time;

    var width = sprite.getBounds().width;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleIn'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    width = width > 50 ? 50 : width;
    var _x = sprite.x;
    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 0,
            x: _x + width,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            sprite.visible = false;
            sprite.alpha = 1;
            sprite.x = _x;
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_right_in(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;

    time = isNaN(Number(time)) ? 200 : time;
    var width = sprite.getBounds().width;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleOut'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    width = width > 50 ? 50 : width;
    var _x = sprite.x;

    sprite.alpha = 0;
    sprite.x = _x - width;
    sprite.visible = true;

    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 1,
            x: _x,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function slide_right_out(
    sprite,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;
    time = isNaN(Number(time)) ? 200 : time;

    var width = sprite.getBounds().width;
    var time_fn: Function = time_name ? Ease[time_name] : Ease['circleIn'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    width = width > 50 ? 50 : width;
    var _x = sprite.x;
    sprite.tween = Tween.to(
        sprite,
        {
            alpha: 0,
            x: _x - width,
        },
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            sprite.visible = false;
            sprite.alpha = 1;
            sprite.x = _x;
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function move(
    sprite,
    start_pos: t_point,
    end_pos: t_point,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    var Tween = new Laya.Tween();
    var Ease = Laya.Ease;

    time = isNaN(Number(time)) ? 700 : time;

    var time_fn = time_fn ? Ease[time_fn] : Ease['cubicInOut'];
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }

    sprite.pos(start_pos.x, start_pos.y);
    sprite.tween = Tween.to(
        sprite,
        end_pos,
        time,
        time_fn,
        Laya.Handler.create(sprite, function() {
            if (callback && typeof callback == 'function') {
                callback();
            }
        }),
    );
}
export function tween(
    sprite,
    start_property: AnyObj,
    end_property: AnyObj,
    time?: number,
    time_fn?: string,
) {
    return new Promise((resolve, reject) => {
        const laya_Tween = new Laya.Tween();
        const Ease = Laya.Ease;

        time = isNaN(Number(time)) ? 700 : time;

        time_fn = time_fn ? Ease[time_fn] : Ease.cubicInOut;
        if (sprite.tween) {
            sprite.tween.complete();
            sprite.tween.clear();
        }
        setStyle(sprite, start_property);
        sprite.tween = laya_Tween.to(
            sprite,
            end_property,
            time,
            time_fn,
            Laya.Handler.create(sprite, () => {
                resolve();
            }),
        );
    });
}
function setStyle(sprite, props) {
    for (const key in props) {
        if (!props.hasOwnProperty(key)) {
            continue;
        }
        sprite[key] = props[key];
    }
}
function jump(sprite, props, time_num) {
    return new Promise((resovle, reject) => {
        setTimeout(() => {
            setStyle(sprite, props);
            resovle();
        }, time_num);
    });
}
export async function tweenLoop(data: {
    sprite;
    props_arr: any[];
    time?: number;
    time_name?: string;
    is_jump?: boolean;
}) {
    const { sprite, props_arr, time, time_name, is_jump } = data;
    const len = props_arr.length;
    let i = 0;
    while (true) {
        if ((sprite as Laya.Sprite).destroyed || sprite.is_stop) {
            break;
        }
        if (is_jump) {
            await jump(sprite, props_arr[i], time);
        } else {
            let next = i + 1;
            if (next >= len) {
                next = 0;
            }
            await tween(sprite, props_arr[i], props_arr[next], time, time_name);
        }
        i++;
        if (i >= len) {
            i = 0;
        }
    }
}

export function stopAni(sprite) {
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    sprite.is_stop = true;
}
export function rotate(
    sprite,
    angle: number,
    time?: number,
    callback?: Function,
    time_name?: string,
) {
    const laya_tween = new Laya.Tween();
    const Ease = Laya.Ease;

    const time_fn = time_fn ? Ease[time_fn] : null;

    sprite.tween = laya_tween.to(
        sprite,
        {
            rotation: angle,
        },
        time || 500,
        time_fn,
        Laya.Handler.create(sprite, () => {
            if (callback && typeof callback === 'function') {
                callback();
            }
        }),
    );
}
