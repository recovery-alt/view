"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const jsonwebtoken_1 = require("jsonwebtoken");
const enum_1 = require("@/enum");
const utils_1 = require("@/utils");
const verifyToken = async (ctx, next) => {
    const token = ctx.request.header.authorization;
    if (!token) {
        if (ctx.url.includes('api/v1/login')) {
            await next();
        }
        else {
            ctx.body = (0, utils_1.wrapError)(enum_1.ResponseEnum.UNAUTHORIZED);
        }
        return;
    }
    try {
        const publicKey = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, '../key/rsa-public-key.pem'));
        const result = (0, jsonwebtoken_1.verify)(token, publicKey, { algorithms: ['RS256'] });
        const { exp, data } = result;
        const now = Math.floor(Date.now() / 1000);
        // 不在有效期内
        if (now >= exp) {
            ctx.body = (0, utils_1.wrapError)(enum_1.ResponseEnum.UNAUTHORIZED);
            return;
        }
        ctx.state.userId = data;
        await next();
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.verifyToken = verifyToken;
