import Router from '@koa/router';
import { pageService } from '@/service';
import { Page } from '@/mongoose';
import { ResponseEnum } from '@/enum';

const router = new Router();

router.get('/', async ctx => {
  ctx.body = await pageService.get();
});

router.get('/:id', async ctx => {
  const { id } = ctx.params;
  ctx.body = await pageService.get(id);
});

router.post('/', async ctx => {
  const body = ctx.request.body as Page;
  await pageService.add(body);
  ctx.body = ResponseEnum.SUCCESS;
});

router.put('/', async ctx => {
  const body = ctx.request.body as Page;
  await pageService.update(body);
  ctx.body = ResponseEnum.SUCCESS;
});

router.delete('/', async ctx => {
  ctx.body = ResponseEnum.SUCCESS;
});

export default router;
