process.env.TS_NODE_DEV || require('module-alias/register');
import Koa from 'koa';
import { port } from '@/config';
import { useRouter, wrapResponse } from '@/middleware';
import chalk from 'chalk';
import { initMongoose } from '@/mongoose';
import logger from 'koa-logger';
import cors from '@koa/cors';
import parser from 'koa-bodyparser';

const app = new Koa();

// 日志中间件
app.use(logger());
// 路由中间件
useRouter(app);
// cors中间件
app.use(cors({ origin: '*', credentials: true }));
// 包裹response
app.use(wrapResponse);
// 处理请求体内容中间件
app.use(parser());
// 初始化连接mongoose
initMongoose();

app.on('error', err => {
  console.error(chalk.red('server error: '), err);
});

app.listen(port, () => {
  const addr = chalk.cyan(`http://localhost:${port}/`);
  console.log(`server is running at ${addr}`);
});
