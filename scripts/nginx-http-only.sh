#!/bin/sh
set -e

NGINX_CONF="./nginx/conf.d/portfolio.conf"
COMPOSE="docker compose -f docker-compose.prod.yml"

printf "Enter your domain: "
read -r DOMAIN

if [ -z "$DOMAIN" ]; then
  echo "Error: domain cannot be empty."
  exit 1
fi

echo "Writing HTTP-only config for $DOMAIN..."

printf 'server {\n' > "$NGINX_CONF"
printf '    listen 80;\n' >> "$NGINX_CONF"
printf '    server_name %s;\n' "$DOMAIN" >> "$NGINX_CONF"
printf '\n' >> "$NGINX_CONF"
printf '    location /.well-known/acme-challenge/ {\n' >> "$NGINX_CONF"
printf '        root /var/www/certbot;\n' >> "$NGINX_CONF"
printf '    }\n' >> "$NGINX_CONF"
printf '\n' >> "$NGINX_CONF"
printf '    location / {\n' >> "$NGINX_CONF"
printf "        return 200 'OK';\n" >> "$NGINX_CONF"
printf '    }\n' >> "$NGINX_CONF"
printf '}\n' >> "$NGINX_CONF"

echo "Config written. Restarting nginx..."
$COMPOSE stop nginx
$COMPOSE up -d nginx

echo "Waiting for nginx..."
sleep 3

$COMPOSE ps nginx
echo "Done. Nginx is running with HTTP-only config for $DOMAIN."
