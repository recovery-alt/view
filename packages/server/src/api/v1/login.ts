import Router from '@koa/router';
import { loginService } from '@/service';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { sign } from 'jsonwebtoken';
import { decrypt } from '@/utils';

const router = new Router();

router.get('/', async ctx => {
  const name = ctx.query.name as string;
  const password = decrypt(ctx.query.password as string);
  const record = await loginService.checkPassword(name, password);
  if (record) {
    const privateKey = readFileSync(resolve(__dirname, '../../key/rsa-private-key.pem'));
    const data = record._id;
    const exp = Math.floor(Date.now() / 1000) + 86400;
    const token = sign({ data, exp }, privateKey, { algorithm: 'RS256' });
    ctx.body = token;
  } else {
    ctx.body = '用户名或密码错误！';
  }
});

export default router;
