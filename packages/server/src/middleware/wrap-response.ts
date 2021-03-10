import { Middleware } from 'koa';
import { wrapResponse as wrap, wrapError } from '@/utils';
import { tips } from '@/config';

export const wrapResponse: Middleware = async (ctx, next) => {
  await next();
  if (/\/api\//.test(ctx.url) && ctx.status === 200) {
    if (typeof ctx.body === 'number' && ctx.body < tips.length) {
      ctx.body = wrapError(ctx.body);
    } else {
      ctx.body = wrap(ctx.body);
    }
  }
};
