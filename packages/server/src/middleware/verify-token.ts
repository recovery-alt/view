import { Middleware } from 'koa';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';
import { ResponseEnum } from '@/enum';
import { wrapError } from '@/utils';

export const verifyToken: Middleware = async (ctx, next) => {
  const token = ctx.request.header.authorization;
  if (!token) {
    if (ctx.url.includes('api/v1/login')) {
      await next();
    } else {
      ctx.body = wrapError(ResponseEnum.UNAUTHORIZED);
    }
    return;
  }
  try {
    const publicKey = readFileSync(resolve(__dirname, '../key/rsa-public-key.pem'));
    const result = verify(token, publicKey, { algorithms: ['RS256'] });
    const { exp } = result as { exp: number };
    const now = Math.floor(Date.now() / 1000);
    // 有效期内
    if (now >= exp) {
      ctx.body = wrapError(ResponseEnum.UNAUTHORIZED);
      return;
    }
    await next();
  } catch (e) {
    throw new Error(e);
  }
};
