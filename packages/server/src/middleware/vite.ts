import Koa from 'koa';
import { createServer, ViteDevServer } from 'vite';
import connect from 'koa-connect';
import Router from '@koa/router';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export const useViteSSR = async (app: Koa) => {
  const viteServer = await createServer({ server: { middlewareMode: 'ssr' } });
  app.use(connect(viteServer.middlewares));
  addRouter(app, viteServer);
};

function addRouter(app: Koa, viteServer: ViteDevServer) {
  const router = new Router();
  const isProd = process.env.NODE_ENV === 'production';

  router.all('/((?!api).*)', async (ctx, next) => {
    const url = ctx.originalUrl;
    let template, render;
    if (isProd) {
      template = readFileSync(resolve(__dirname, '../public/share.html'), 'utf-8');
      render = require(`../public/render.js`).render;
    } else {
      template = readFileSync(resolve(__dirname, '../../../client/share.html'), 'utf-8');
      const entryPath = resolve(__dirname, '../../../client/src/share/entry-server.ts');
      const entryServer = await viteServer.ssrLoadModule(entryPath);
      render = entryServer.render;
    }
    console.log(render);
    const [appHtml, preloadLinks] = await render(url, {}, process.cwd());
    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml);

    ctx.status = 200;
    ctx.res.setHeader('Content-Type', 'text/html');

    ctx.body = html;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
