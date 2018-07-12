type FuncVoid = (...args: any[]) => void;
type Func<T> = (...args: any[]) => T;
type FuncListener = (data: AnyObj) => void;
type AnyObj = { [x: string]: any };
type ValOfObj<T> = T[keyof T];
// type ValOfObj<T> = P extends keyof T ? T[P] : never;
