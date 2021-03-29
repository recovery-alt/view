#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

cd packages/server

yarn ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/app.ts

cd -
