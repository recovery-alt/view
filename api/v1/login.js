"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const router_1 = tslib_1.__importDefault(require("@koa/router"));
const service_1 = require("@/service");
const fs_1 = require("fs");
const path_1 = require("path");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("@/utils");
const enum_1 = require("@/enum");
const router = new router_1.default();
router.get('/', async (ctx) => {
    const name = ctx.query.name;
    const password = (0, utils_1.decrypt)(ctx.query.password);
    const record = await service_1.loginService.checkPassword(name, password);
    if (record) {
        const privateKey = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, '../../key/rsa-private-key.pem'));
        const { _id: data, name } = record;
        const exp = Math.floor(Date.now() / 1000) + 86400;
        const token = (0, jsonwebtoken_1.sign)({ data, exp }, privateKey, { algorithm: 'RS256' });
        ctx.body = { token, name };
    }
    else {
        ctx.body = enum_1.ResponseEnum.USER_OR_PASSWORD_ERROR;
    }
});
exports.default = router;
