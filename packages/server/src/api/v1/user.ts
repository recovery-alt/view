import Router from '@koa/router';
import { userService } from '@/service';
import { decrypt } from '@/utils';

const router = new Router();

router.get('/', async ctx => {
  ctx.body = await userService.get();
});

router.post('/changePassword', async ctx => {
  const { password, newPassword } = ctx.request.body as Data<string>;
  const decryptArr = decrypt<[string, string]>([password, newPassword]);
  const { userId } = ctx.state;
  ctx.body = await userService.changePassword(userId, ...decryptArr);
});

export default router;
