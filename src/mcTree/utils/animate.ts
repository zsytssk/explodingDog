export function fade_in(sprite, time?: number, time_name?: string) {
    const start_props = {
        alpha: 0,
        visible: true,
    };
    time = time ? 700 : time;

    time_name = time_name || 'circleOut';
    const end_props = {
        alpha: 1,
    };
    return tween({
        end_props,
        sprite,
        start_props,
        time,
        time_name,
    });
}
export function fade_out(sprite, time?: number, time_name?: string) {
    time = time ? 700 : time;

    time_name = time_name || 'circleOut';
    const end_props = {
        alpha: 0,
    };
    return tween({
        end_props,
        sprite,
        time,
        time_name,
    }).then(() => {
        sprite.visible = false;
        sprite.alpha = 1;
    });
}
export function scale_in(sprite, time?: number, time_name?: string) {
    time_name = time_name || 'circleIn';
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

    return tween({ sprite, start_props, end_props, time, time_name });
}
export function scale_out(sprite, time?: number, time_name?: string) {
    time_name = time_name || 'circleIn';
    time = time || 400;
    const end_props = {
        alpha: 0.2,
        scaleX: 0.2,
        scaleY: 0.2,
    };

    return tween({ sprite, end_props, time, time_name }).then(() => {
        setStyle(sprite, { visible: false, scaleX: 1, scaleY: 1, alpha: 1 });
    });
}
export function slide_up_in(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    time_name = time_name || 'circleOut';
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

    return tween({ sprite, start_props, end_props, time, time_name });
}
export function slide_up_out(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    time_name = time_name || 'circleIn';
    time = time || 200;
    const ori_y = sprite.y;
    const end_props = {
        alpha: 0,
        y: ori_y - space,
    };

    return tween({ sprite, end_props, time, time_name }).then(() => {
        setStyle(sprite, { visible: false, alpha: 1, y: ori_y });
    });
}
export function slide_down_in(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    time_name = time_name || 'circleOut';
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

    return tween({ sprite, start_props, end_props, time, time_name });
}
export function slide_down_out(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const height = sprite.getBounds().height;
        space = height > 50 ? 50 : height;
    }
    time_name = time_name || 'circleIn';
    time = time || 200;
    const ori_y = sprite.y;
    const end_props = {
        alpha: 0,
        y: ori_y + space,
    };

    return tween({ sprite, end_props, time, time_name }).then(() => {
        setStyle(sprite, { visible: false, alpha: 1, y: ori_y });
    });
}
export function slide_left_in(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    time_name = time_name || 'circleOut';
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

    return tween({ sprite, start_props, end_props, time, time_name });
}
export function slide_left_out(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    time_name = time_name || 'circleIn';
    time = time || 200;
    const ori_x = sprite.x;
    const end_props = {
        alpha: 0,
        x: ori_x + space,
    };

    return tween({ sprite, end_props, time, time_name }).then(() => {
        sprite.visible = false;
        sprite.alpha = 1;
        sprite.x = ori_x;
    });
}
export function slide_right_in(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    time_name = time_name || 'circleOut';
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

    return tween({ sprite, start_props, end_props, time, time_name });
}
export function slide_right_out(
    sprite,
    time?: number,
    time_name?: string,
    space?: number,
) {
    if (!space) {
        const width = sprite.getBounds().width;
        space = width > 50 ? 50 : width;
    }
    time_name = time_name || 'circleIn';
    time = time || 200;
    const ori_x = sprite.x;
    const end_props = {
        alpha: 0,
        x: ori_x - space,
    };

    return tween({ sprite, end_props, time, time_name }).then(() => {
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
    time_name?: string;
}) {
    return new Promise((resolve, reject) => {
        const { sprite, time_name, start_props, end_props } = data;
        let { time } = data;
        const laya_Tween = new Laya.Tween();
        const Ease = Laya.Ease;

        time = time || 700;

        const time_fn = time_name ? Ease[time_name] : Ease.cubicInOut;
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
            sprite,
            end_props,
            time,
            time_fn,
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
            const start_props = props_arr[i];
            const end_props = props_arr[next];
            await tween({
                end_props,
                sprite,
                start_props,
                time,
                time_name,
            });
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
    time_name?: string,
) {
    const ori_angle = Number(sprite.rotation);
    if (ori_angle !== ori_angle) {
        sprite.rotation = 0;
    }
    const end_props = {
        rotation: angle,
    };
    return tween({ sprite, end_props, time, time_name });
}
