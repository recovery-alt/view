#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf dist

cd packages/server

yarn tsc

wait

mv dist ../../

cd ../client

yarn vuedx-typecheck . && yarn vite build

wait

mv dist ../../dist

cd -