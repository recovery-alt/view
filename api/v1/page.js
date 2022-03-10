"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const router_1 = tslib_1.__importDefault(require("@koa/router"));
const service_1 = require("@/service");
const enum_1 = require("@/enum");
const router = new router_1.default();
router.get('/', async (ctx) => {
    ctx.body = await service_1.pageService.get();
});
router.get('/:id', async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await service_1.pageService.get(id);
});
router.post('/', async (ctx) => {
    const body = ctx.request.body;
    ctx.body = await service_1.pageService.add(body);
});
router.put('/', async (ctx) => {
    const body = ctx.request.body;
    await service_1.pageService.update(body);
    ctx.body = enum_1.ResponseEnum.SUCCESS;
});
router.delete('/:id', async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await service_1.pageService.delete(id);
});
exports.default = router;
