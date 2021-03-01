import Koa from 'koa';
import { readdirSync } from 'fs';
import { resolve } from 'path';

export const useRouter = async (app: Koa) => {
  const prefix = '/api/v1/';
  const dirname = resolve(__dirname, `..${prefix}`);
  const files = readdirSync(dirname);
  for (let i = 0, len = files.length; i < len; i++) {
    const file = files[i];
    const matcher = file.match(/^([a-zA-Z-_]+)\.[tj]s/);
    const { default: router } = await import(`..${prefix}${file}`);
    if (matcher && matcher[1]) {
      router.prefix(`${prefix}${matcher[1]}`);
      app.use(router.routes()).use(router.allowedMethods());
    }
  }
};
