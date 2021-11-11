"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPAdress = exports.decrypt = exports.to = exports.wrapError = exports.wrapResponse = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const node_forge_1 = require("node-forge");
const config_1 = require("@/config");
const os_1 = require("os");
const wrapResponse = (data, code = 0) => ({ data, code, msg: 'success' });
exports.wrapResponse = wrapResponse;
const wrapError = (code) => ({ msg: config_1.tips[code], code });
exports.wrapError = wrapError;
// 包裹async/await错误处理
const to = (promise) => promise.then(data => [null, data]).catch(err => [err]);
exports.to = to;
const decrypt = input => {
    const privateKey = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, '../key/rsa-private-key.pem'), 'utf8');
    const privateK = node_forge_1.pki.privateKeyFromPem(privateKey);
    const decryptInput = (str) => {
        const encrypted = Buffer.from(str, 'base64').toString();
        const decrypted = privateK.decrypt(encrypted, 'RSA-OAEP');
        return decodeURIComponent(decrypted);
    };
    const result = Array.isArray(input) ? input.map(decryptInput) : decryptInput(input);
    return result;
};
exports.decrypt = decrypt;
const getIPAdress = () => {
    const interfaces = (0, os_1.networkInterfaces)();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        if (!iface)
            continue;
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
};
exports.getIPAdress = getIPAdress;
