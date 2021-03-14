# view

## 提交代码规范

以下是 angular 的提交规范，建议使用起来～

- build: 构建打包
- ci: 持续集成相关
- chore: 修改工具相关（包括但不限于文档、代码生成等, 比如修改了 README，webpack 配置文件等等）
- docs: 修改文档
- feat: 新功能
- fix: 修复问题
- perf: 提升页面性能
- refactor: 重构代码(fix bug 或增加新功能不属于此范围)
- revert: 回滚版本
- style: 修改代码格式(不影响逻辑功能，比如格式化、补充分号等等)
- test: 增加/修改测试用例

## 命名规范

- 文件和文件夹采用`layer-panel`这个方式命名，尽量不使用大写
- 变量名采用驼峰命名，类名首字母大写
- .vue 文件必须指明 name，小写，多个单词用`-`连接
- 在 template 中使用的话用这个方式`<layer-panel />`
- import 进来的组件，首字母大写
- .env 文件采用这个方式`NODE_ENV=production`，变量名大写，多个单词用`_`隔开，等号两边不加空格
