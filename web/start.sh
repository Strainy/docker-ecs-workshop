#!/bin/ash
set -e

NGINX_DIR="/usr/share/nginx/html/"

# Substitute configuration via environment variable
echo "Connecting to API Server at: $API_ENDPOINT"
sed "s|{{API_ENDPOINT}}|${API_ENDPOINT}|g" $NGINX_DIR/config.env > $NGINX_DIR/config-processed.env

# start nginx
nginx -g "daemon off;"
