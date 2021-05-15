#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

cd packages/client

yarn vite --host

cd -
