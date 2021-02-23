import Router from '@koa/router';
import { userService } from '@/service';

const router = new Router();

router.get('/', async ctx => {
  const data = await userService.get();
  ctx.body = data;
});

router.get('/add', async ctx => {
  ctx.body = 'success';
});

export default router;
