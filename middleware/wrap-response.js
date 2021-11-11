"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapResponse = void 0;
const utils_1 = require("@/utils");
const config_1 = require("@/config");
const wrapResponse = async (ctx, next) => {
    await next();
    if (/\/api\//.test(ctx.url) && ctx.status === 200) {
        if (typeof ctx.body === 'number' && ctx.body < config_1.tips.length) {
            ctx.body = (0, utils_1.wrapError)(ctx.body);
        }
        else {
            ctx.body = (0, utils_1.wrapResponse)(ctx.body);
        }
    }
};
exports.wrapResponse = wrapResponse;
