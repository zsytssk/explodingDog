export function callFunc(func) {
    if (!isFunc(func)) {
        return;
    }
    func();
}

export function isFunc(func): boolean {
    return func && typeof func === 'function';
}

export function splitPath(path) {
    const arr = path.split('/');
    while (true) {
        if (arr[0] === '') {
            arr.shift();
        }
        break;
    }
    return arr;
}
export function delArrSameItem<T>(arr1: T[], arr2: T[]): T[][] {
    let same_num = 0;
    for (let len = arr1.length, i = 0; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
            break;
        }
        same_num++;
    }
    arr1.splice(0, same_num);
    arr2.splice(0, same_num);
    return [arr1, arr2];
}
