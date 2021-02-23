import Router from '@koa/router';
import { pageService } from '@/service';
import { Page } from '@/mongoose';

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
  ctx.body = 'success';
});

router.put('/', async ctx => {
  const body = ctx.request.body as Page;
  await pageService.update(body);
  ctx.body = 'success';
});

router.delete('/', async ctx => {
  ctx.body = 'delete';
});

export default router;
