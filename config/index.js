"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tips = exports.mongoUri = exports.port = void 0;
exports.port = 3000;
// mongo "mongodb+srv://cluster0.4kwac.mongodb.net/<dbname>" --username ccq
exports.mongoUri = 'mongodb+srv://ccq:dsa6200269@cluster0.4kwac.mongodb.net/view?retryWrites=true&w=majority';
exports.tips = [
    'success',
    '用户名或密码错误！',
    '令牌已失效，请重新授权！',
    '原密码有误，请重新输入！',
    '未检测到登录用户，请重新登录！',
];
