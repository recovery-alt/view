"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const router_1 = tslib_1.__importDefault(require("@koa/router"));
const service_1 = require("@/service");
const utils_1 = require("@/utils");
const router = new router_1.default();
router.get('/', async (ctx) => {
    ctx.body = await service_1.userService.get();
});
router.post('/changePassword', async (ctx) => {
    const { password, newPassword } = ctx.request.body;
    const decryptArr = (0, utils_1.decrypt)([password, newPassword]);
    const { userId } = ctx.state;
    ctx.body = await service_1.userService.changePassword(userId, ...decryptArr);
});
exports.default = router;
