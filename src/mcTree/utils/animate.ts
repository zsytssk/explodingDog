export function fade_in(sprite, time?: number, ease_fn?: string) {
    const start_props = {
        alpha: 0,
        visible: true,
    };
    time = time ? 700 : time;

    ease_fn = ease_fn || 'circleOut';
    const end_props = {
        alpha: 1,
    };
    return tween({
        ease_fn,
        end_props,
        sprite,
        start_props,
        time,
    });
}
export function fade_out(sprite, time?: number, ease_fn?: string) {
    time = time ? 700 : time;

    ease_fn = ease_fn || 'circleOut';
    const end_props = {
        alpha: 0,
    };
    return tween({
        ease_fn,
        end_props,
        sprite,
        time,
    }).then(() => {
        sprite.visible = false;
        sprite.alpha = 1;
    });
}
export function scale_in(sprite, time?: number, ease_fn?: string) {
    ease_fn = ease_fn || 'circleIn';
    time = time || 400;
    const start_props = {
        alpha: 0.2,
        scaleX: 0.2,
        scaleY: 0.2,
        visible: true,
    };
    const end_props = {
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
    };

    return tween({ sprite, start_props, end_props, time, ease_fn });
}
export function scale_out(sprite, time?: number, ease_fn?: string) {
    ease_fn = ease_fn || 'circleIn';
    time = time || 400;
    const end_props = {
        alpha: 0.2,
        scaleX: 0.2,
        scaleY: 0.2,
    };

    return tween({ sprite, end_props, time, ease_fn }).then(() => {
        setStyle(sprite, { visible: false, scaleX: 1, scaleY: 1, alpha: 1 });
    });
}
export function slide_up_in(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    ease_fn = ease_fn || 'circleOut';
    time = time || 200;
    const ori_y = sprite.y;
    const start_props = {
        alpha: 0,
        visible: true,
        y: ori_y + space,
    };
    const end_props = {
        alpha: 1,
        y: ori_y,
    };

    return tween({ sprite, start_props, end_props, time, ease_fn });
}
export function slide_up_out(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    ease_fn = ease_fn || 'circleIn';
    time = time || 200;
    const ori_y = sprite.y;
    const end_props = {
        alpha: 0,
        y: ori_y - space,
    };

    return tween({ sprite, end_props, time, ease_fn }).then(() => {
        setStyle(sprite, { visible: false, alpha: 1, y: ori_y });
    });
}
export function slide_down_in(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    ease_fn = ease_fn || 'circleOut';
    time = time || 200;
    const ori_y = sprite.y;
    const start_props = {
        alpha: 0,
        visible: true,
        y: ori_y - space,
    };
    const end_props = {
        alpha: 1,
        y: ori_y,
    };

    return tween({ sprite, start_props, end_props, time, ease_fn });
}
export function slide_down_out(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    ease_fn = ease_fn || 'circleIn';
    time = time || 200;
    const ori_y = sprite.y;
    const end_props = {
        alpha: 0,
        y: ori_y + space,
    };

    return tween({ sprite, end_props, time, ease_fn }).then(() => {
        setStyle(sprite, { visible: false, alpha: 1, y: ori_y });
    });
}
export function slide_left_in(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    ease_fn = ease_fn || 'circleOut';
    time = time || 200;
    const ori_x = sprite.x;
    const start_props = {
        alpha: 0,
        visible: true,
        x: ori_x + space,
    };
    const end_props = {
        alpha: 1,
        x: ori_x,
    };

    return tween({ sprite, start_props, end_props, time, ease_fn });
}
export function slide_left_out(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    ease_fn = ease_fn || 'circleIn';
    time = time || 200;
    const ori_x = sprite.x;
    const end_props = {
        alpha: 0,
        x: ori_x + space,
    };

    return tween({ sprite, end_props, time, ease_fn }).then(() => {
        sprite.visible = false;
        sprite.alpha = 1;
        sprite.x = ori_x;
    });
}
export function slide_right_in(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    ease_fn = ease_fn || 'circleOut';
    time = time || 200;
    const ori_x = sprite.x;
    const start_props = {
        alpha: 0,
        visible: true,
        x: ori_x - space,
    };
    const end_props = {
        alpha: 1,
        x: ori_x,
    };

    return tween({ sprite, start_props, end_props, time, ease_fn });
}
export function slide_right_out(
    sprite,
    time?: number,
    ease_fn?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    ease_fn = ease_fn || 'circleIn';
    time = time || 200;
    const ori_x = sprite.x;
    const end_props = {
        alpha: 0,
        x: ori_x - space,
    };

    return tween({ sprite, end_props, time, ease_fn }).then(() => {
        sprite.visible = false;
        sprite.alpha = 1;
        sprite.x = ori_x;
    });
}
export function tween(data: {
    sprite;
    start_props?: AnyObj;
    end_props: AnyObj;
    time?: number;
    ease_fn?: string | Func<number>;
}) {
    return new Promise((resolve, reject) => {
        const { sprite, start_props, end_props } = data;
        let { ease_fn } = data;

        let { time } = data;
        const laya_Tween = new Laya.Tween();
        const Ease = Laya.Ease;

        time = time || 700;

        ease_fn = ease_fn || Ease.cubicInOut;
        if (typeof ease_fn === 'string') {
            ease_fn = Ease[ease_fn];
        }
        if (sprite.tween) {
            sprite.tween.complete();
            sprite.tween.clear();
        }
        setStyle(sprite, start_props);

        /** 如果本身已经是那个属性就不做任何处理 */
        for (const key in end_props) {
            if (sprite[key] === end_props[key]) {
                delete end_props[key];
            }
        }
        if (!Object.keys(end_props).length) {
            resolve();
        }

        sprite.tween = laya_Tween.to(
            end_props,
            sprite,
            time,
            ease_fn as Func<number>,
            Laya.Handler.create(sprite, () => {
                resolve();
            }),
        );
    });
}
function setStyle(sprite, props) {
    if (!props) {
        return;
    }
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
    ease_fn?: string;
    is_jump?: boolean;
}) {
    const { sprite, props_arr, time, ease_fn, is_jump } = data;
    const len = props_arr.length;
    let i = 0;
    stopAni(sprite);

    /** 等待原来的动画结束再继续执行 */
    setTimeout(async () => {
        sprite.is_stop = false;
        while (true) {
            if (is_jump) {
                await jump(sprite, props_arr[i], time);
            } else {
                let next = i + 1;
                if (next >= len) {
                    next = 0;
                }
                const start_props = props_arr[i];
                const end_props = props_arr[next];
                await tween({
                    ease_fn,
                    end_props,
                    sprite,
                    start_props,
                    time,
                });
            }
            i++;
            if (i >= len) {
                i = 0;
            }
            if ((sprite as Laya.Sprite).destroyed || sprite.is_stop) {
                break;
            }
        }
    });
}

export function stopAni(sprite) {
    if (sprite.tween) {
        sprite.tween.complete();
        sprite.tween.clear();
    }
    sprite.is_stop = true;
}
export function rotate(sprite, angle: number, time?: number, ease_fn?: string) {
    const ori_angle = Number(sprite.rotation);
    if (ori_angle !== ori_angle) {
        sprite.rotation = 0;
    }
    const end_props = {
        rotation: angle,
    };
    return tween({ sprite, end_props, time, ease_fn });
}
