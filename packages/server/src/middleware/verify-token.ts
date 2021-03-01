import { Context, Next } from 'koa';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';

export const verifyToken = async (ctx: Context, next: Next) => {
  const token = ctx.request.header.authorization;
  if (!token) return;
  try {
    const publicKey = readFileSync(resolve(__dirname, '../key/rsa-public-key.pem'));
    const result = verify(token, publicKey, { algorithms: ['RS256'] }) as {
      data: string;
      exp: number;
    };
    const { exp } = result;
    const now = Math.floor(Date.now() / 1000);
    // 有效期内
    if (now < exp) {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = { code: 1, msg: '令牌已失效，请重新授权！' };
    }
  } catch (e) {
    throw new Error(e);
  }
};
