#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf dist

cd packages/server

tsc

printf '服务端打包完成！\n'
mv dist ../../
cp -r src/key ../../dist
cp -r src/public ../../dist

cd ../client

vue-tsc --noEmit && vite build

cp -r dist/* ../../dist/public

rm -rf dist

printf '客户端打包完成！\n'

cd -
