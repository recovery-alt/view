import { Middleware } from 'koa';
import { verify } from 'jsonwebtoken';
import { ResponseEnum } from '@/enum';
import { wrapError } from '@/utils';
import { publicKey } from '@/key';

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
    const result = verify(token, publicKey, { algorithms: ['RS256'] });
    const { exp, data } = result as { exp: number; data: string };
    const now = Math.floor(Date.now() / 1000);
    // 不在有效期内
    if (now >= exp) {
      ctx.body = wrapError(ResponseEnum.UNAUTHORIZED);
      return;
    }
    ctx.state.userId = data;
    await next();
  } catch (e: any) {
    throw new Error(e);
  }
};
