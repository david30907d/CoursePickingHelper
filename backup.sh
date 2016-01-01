#!/bin/bash
# Program:
#       Program automatically backup my nchu json.
# History:
# 2016/01/01    david   First release

# 3. 開始利用 date 指令來取得所需要的檔名了；
date=$(date +%Y%m%d)  # 今天的日期
time=$(date | awk '{print $4}')
char="_"           
folder="${date}-${time}"

#echo "${folder}"
cp -r ./json ./backup-json/${folder}
