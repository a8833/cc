#!/bin/bash
ulimit -SHn 65535
for n in $(seq $1); do
node cc+.js $2 $3 $4 $5 &
done