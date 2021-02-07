/* eslint-disable */
const chalk = require('chalk');
const msgPath = process.env.HUSKY_GIT_PARAMS;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(feat|fix|docs|style|refactor|perf|test|chore|deps|subject|body)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(' 错误 ')} ${chalk.red('提交消息格式不对。')}\n\n` +
      chalk.red('  提交消息时，需要遵守规范。示例:\n\n') +
      `    ${chalk.green('feat: 新功能')}\n` +
      `    ${chalk.green('subject(pages): 用一句话清楚的描述这次提交做了什么')}\n\n` +
      chalk.red('  可以按照 README.md 规范进行提交。\n')
  );
  process.exit(1);
}
