process.env.TS_NODE_DEV || require('module-alias/register');
import Koa from 'koa';
import { port } from '@/config';
import { useRouter, wrapResponse, verifyToken } from '@/middleware';
import pc from 'picocolors';
import { initMongoose } from '@/mongoose';
import logger from 'koa-logger';
import cors from '@koa/cors';
import parser from 'koa-bodyparser';
import server from 'koa-static';
import { resolve } from 'path';
import historyApiFallback from 'koa2-connect-history-api-fallback';
import { getIPAdress } from '@/utils';

const app = new Koa();

// 处理history模式中间件
app.use(historyApiFallback({ whiteList: ['/api'] }));
// 日志中间件
app.use(logger());
// 路由中间件
useRouter(app);
// 静态资源中间件
app.use(server(resolve(__dirname, './public')));
// cors中间件
app.use(cors({ origin: '*', credentials: true }));
// 验证token的中间件
app.use(verifyToken);
// 包裹response
app.use(wrapResponse);
// 处理请求体内容中间件
app.use(parser());
// 初始化连接mongoose
initMongoose();

app.on('error', err => {
  console.error(pc.red('server error: '), err);
});

app.listen(port, () => {
  const addr = pc.cyan(`http://localhost:${port}/`);
  console.log(`> local:    ${addr}`);
  const ip = getIPAdress();
  if (ip) {
    const addr = pc.cyan(`http://${ip}:${port}/`);
    console.log(`> Network:  ${addr}`);
  }
});
