#!/bin/sh
set -e

COMPOSE="docker compose -f docker-compose.prod.yml"
NGINX_CONF="./nginx/conf.d/portfolio.conf"

printf "Domain (e.g. lucascodev.com.br): "
read -r DOMAIN

printf "Email for Let's Encrypt: "
read -r EMAIL

echo ""
echo "▶ Writing temporary HTTP-only nginx config..."
cat > "$NGINX_CONF" << NGINX
server {
    listen 80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'OK';
    }
}
NGINX

echo "▶ Restarting nginx with HTTP-only config..."
$COMPOSE restart nginx

echo "▶ Waiting for nginx to be ready..."
sleep 3

echo "▶ Running Certbot..."
$COMPOSE run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d "$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email

echo "▶ Restoring full nginx config from git..."
git checkout -- "$NGINX_CONF"

echo "▶ Restarting nginx with SSL config..."
$COMPOSE restart nginx

echo ""
echo "SSL setup complete! https://$DOMAIN"
