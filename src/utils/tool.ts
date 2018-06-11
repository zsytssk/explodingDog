export function callFunc(func) {
    if (!isFunc(func)) {
        return;
    }
    func();
}

export function isFunc(func): boolean {
    return func && typeof func === 'function';
}
