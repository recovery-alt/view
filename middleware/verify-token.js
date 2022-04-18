"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const enum_1 = require("@/enum");
const utils_1 = require("@/utils");
const key_1 = require("@/key");
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
        const result = (0, jsonwebtoken_1.verify)(token, key_1.publicKey, { algorithms: ['RS256'] });
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
