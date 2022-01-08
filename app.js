"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
process.env.TS_NODE_DEV || require('module-alias/register');
const koa_1 = (0, tslib_1.__importDefault)(require("koa"));
const config_1 = require("@/config");
const middleware_1 = require("@/middleware");
const picocolors_1 = (0, tslib_1.__importDefault)(require("picocolors"));
const mongoose_1 = require("@/mongoose");
const koa_logger_1 = (0, tslib_1.__importDefault)(require("koa-logger"));
const cors_1 = (0, tslib_1.__importDefault)(require("@koa/cors"));
const koa_bodyparser_1 = (0, tslib_1.__importDefault)(require("koa-bodyparser"));
const koa_static_1 = (0, tslib_1.__importDefault)(require("koa-static"));
const path_1 = require("path");
const koa2_connect_history_api_fallback_1 = (0, tslib_1.__importDefault)(require("koa2-connect-history-api-fallback"));
const utils_1 = require("@/utils");
const app = new koa_1.default();
// 处理history模式中间件
app.use((0, koa2_connect_history_api_fallback_1.default)({ whiteList: ['/api'] }));
// 日志中间件
app.use((0, koa_logger_1.default)());
// 路由中间件
(0, middleware_1.useRouter)(app);
// 静态资源中间件
app.use((0, koa_static_1.default)((0, path_1.resolve)(__dirname, './public')));
// cors中间件
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
// 验证token的中间件
app.use(middleware_1.verifyToken);
// 包裹response
app.use(middleware_1.wrapResponse);
// 处理请求体内容中间件
app.use((0, koa_bodyparser_1.default)());
// 初始化连接mongoose
(0, mongoose_1.initMongoose)();
app.on('error', err => {
    console.error(picocolors_1.default.red('server error: '), err);
});
app.listen(config_1.port, () => {
    const addr = picocolors_1.default.cyan(`http://localhost:${config_1.port}/`);
    console.log(`> local:    ${addr}`);
    const ip = (0, utils_1.getIPAdress)();
    if (ip) {
        const addr = picocolors_1.default.cyan(`http://${ip}:${config_1.port}/`);
        console.log(`> Network:  ${addr}`);
    }
});
