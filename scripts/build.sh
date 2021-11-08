#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf dist

cd packages/server

npx tsc

printf '服务端打包完成！\n'
mv dist ../../
cp -r src/key ../../dist
cp -r src/public ../../dist
cp package.json ../../dist

cd ../client

npx vue-tsc --noEmit && npx vite build

cp -r dist/* ../../dist/public

rm -rf dist

printf '客户端打包完成！\n'

cd -
