import Router from '@koa/router';
import { userService } from '@/service';
import { ResponseEnum } from '@/enum';

const router = new Router();

router.get('/', async ctx => {
  ctx.body = await userService.get();
});

router.get('/add', async ctx => {
  ctx.body = ResponseEnum.SUCCESS;
});

export default router;
