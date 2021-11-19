import rimraf from 'rimraf';
import { execaSync } from 'execa';
import { resolve } from 'path';
import chalk from 'chalk';
import { copySync } from 'fs-extra';

const getPath = (path = '', workspace = 'server') => resolve(`packages/${workspace}/${path}`);

rimraf.sync(resolve('dist'));
rimraf.sync(getPath('dist'));
rimraf.sync(getPath('dist', 'client'));

execaSync('pnpm', ['build', '--filter', './packages/server'], { stdio: 'inherit' });

copySync(getPath('src/key'), getPath('dist/key'));
copySync(getPath('src/public'), getPath('dist/public'));
copySync(getPath('package.json'), resolve('dist/package.json'));
copySync(getPath('dist'), resolve('dist'));
rimraf.sync(getPath('dist'));
console.log(chalk.green('服务端打包完成！'));

execaSync('pnpm', ['build', '--filter', './packages/client'], { stdio: 'inherit' });
copySync(getPath('dist', 'client'), resolve('dist/public'));
rimraf.sync(getPath('dist', 'client'));

console.log(chalk.green('客户端打包完成！'));
