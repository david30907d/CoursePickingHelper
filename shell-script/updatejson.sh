#!/bin/bash
#update:mv new json to coursepickinghelper/json
time=$(date | awk '{print $4}')
#要把指令的結果回傳給變數的話要寫$( command )
cp -r /var/www/html/Python-Crawler/nchu/json /var/www/html/CoursePickingHelper
echo "[\"https://onepiece.nchu.edu.tw/cofsys/plsql/Syllabus_main_q?v_strm=1042&v_class_nbr=\",\"${time}\"]" > /var/www/html/CoursePickingHelper/json/url_base.json
exit 0
