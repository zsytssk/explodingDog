import { CONFIG } from './app/data/config';
import { load_util } from './utils/load';
import { detectModel } from './utils/zutil';

interface CusWindow extends Window {
    load_util: typeof load_util;
    CONFIG: typeof CONFIG;
}
if (detectModel('showStat')) {
    Laya.Stat.show(0, 0);
}
(window as CusWindow).load_util = load_util;
(window as CusWindow).CONFIG = CONFIG;

const token = {
    '4001':
        // tslint:disable-next-line:max-line-length
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQwMDEsImV4cCI6MTUyODc4NDc1NTQ2MDAwMH0.Vc1LkeXbPWAI1FgpvqN2S5vKogYSogSIC1rRLJC87M8',
    '4002':
        // tslint:disable-next-line:max-line-length
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQwMDIsImV4cCI6MTUyODc4NDc1NTQ2MTAwMH0.e_wtFR6fyB7fdreVV3wqDb0yk0QNnTGVmyLH88pZ01c',
    '4003':
        // tslint:disable-next-line:max-line-length
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQwMDMsImV4cCI6MTUyODc4NDc1NTQ2MjAwMH0.JLu4ZSLEtbLd9zluIQDdRJtPjilBP7mDwxx1Y27jeok',
    '4004':
        // tslint:disable-next-line:max-line-length
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQwMDQsImV4cCI6MTUyODc4NDc1NTQ2MzAwMH0.56XTD3hxjrH-8KoiuBDjFIk2-qVUrHjNCSTXrdmCxoc',
};
if (detectModel('user_id')) {
    const user_id = detectModel('user_id');
    CONFIG.user_id = user_id;
    CONFIG.token = token[user_id];
}
