import { Context, Next } from 'koa';
import { wrapResponse as wrap } from '@/utils';

export const wrapResponse = async (ctx: Context, next: Next) => {
  await next();
  if (/\/api\//.test(ctx.url)) {
    ctx.body = wrap(ctx.body);
  }
};
