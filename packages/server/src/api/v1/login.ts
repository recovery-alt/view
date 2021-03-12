import Router from '@koa/router';
import { loginService } from '@/service';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { sign } from 'jsonwebtoken';
import { decrypt } from '@/utils';
import { ResponseEnum } from '@/enum';

const router = new Router();

router.get('/', async ctx => {
  const name = ctx.query.name as string;
  const password = decrypt(ctx.query.password as string);
  const record = await loginService.checkPassword(name, password);
  if (record) {
    const privateKey = readFileSync(resolve(__dirname, '../../key/rsa-private-key.pem'));
    const { _id: data, name } = record;
    const exp = Math.floor(Date.now() / 1000) + 86400;
    const token = sign({ data, exp }, privateKey, { algorithm: 'RS256' });
    ctx.body = { token, name };
  } else {
    ctx.body = ResponseEnum.USER_OR_PASSWORD_ERROR;
  }
});

export default router;
