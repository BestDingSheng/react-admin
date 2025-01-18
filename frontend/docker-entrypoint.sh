#!/bin/sh

# 使用环境变量替换 nginx.conf 中的变量
envsubst '${BACKEND_API_URL} ${BACKEND_WS_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# 启动 nginx
exec nginx -g 'daemon off;' 