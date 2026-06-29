#!/bin/sh
set -e

NGINX_CONF="./nginx/conf.d/portfolio.conf"
COMPOSE="docker compose -f docker-compose.prod.yml"

# ── interactive inputs ─────────────────────────────────────────────────────────
printf "Enter your domain (e.g. example.com): "
read -r DOMAIN

printf "Enter your email for Let's Encrypt: "
read -r EMAIL

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Error: domain and email are required."
  exit 1
fi

echo ""
echo "Domain : $DOMAIN"
echo "Email  : $EMAIL"
printf "Proceed? [y/N]: "
read -r CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Aborted."
  exit 0
fi

# ── step 1: write HTTP-only config (no heredoc to avoid variable issues) ───────
echo ""
echo "[1/4] Writing HTTP-only nginx config..."

printf 'server {\n'                                          > "$NGINX_CONF"
printf '    listen 80;\n'                                   >> "$NGINX_CONF"
printf '    server_name %s;\n' "$DOMAIN"                   >> "$NGINX_CONF"
printf '\n'                                                 >> "$NGINX_CONF"
printf '    location /.well-known/acme-challenge/ {\n'     >> "$NGINX_CONF"
printf '        root /var/www/certbot;\n'                   >> "$NGINX_CONF"
printf '    }\n'                                            >> "$NGINX_CONF"
printf '\n'                                                 >> "$NGINX_CONF"
printf '    location / {\n'                                 >> "$NGINX_CONF"
printf "        return 200 'OK';\n"                        >> "$NGINX_CONF"
printf '    }\n'                                            >> "$NGINX_CONF"
printf '}\n'                                               >> "$NGINX_CONF"

# ── step 2: restart nginx with HTTP-only config ────────────────────────────────
echo "[2/4] Starting nginx with HTTP-only config..."
$COMPOSE stop nginx
$COMPOSE up -d nginx
sleep 3

# ── step 3: obtain SSL certificate ────────────────────────────────────────────
echo "[3/4] Running Certbot..."
$COMPOSE run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d "$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email

# ── step 4: write full SSL config and restart nginx ───────────────────────────
echo "[4/4] Writing SSL nginx config and restarting..."

printf 'server {\n'                                                             > "$NGINX_CONF"
printf '    listen 80;\n'                                                      >> "$NGINX_CONF"
printf '    server_name _;\n'                                                  >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf '    location /.well-known/acme-challenge/ {\n'                        >> "$NGINX_CONF"
printf '        root /var/www/certbot;\n'                                      >> "$NGINX_CONF"
printf '    }\n'                                                               >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf '    location / {\n'                                                    >> "$NGINX_CONF"
printf '        return 301 https://$host$request_uri;\n'                       >> "$NGINX_CONF"
printf '    }\n'                                                               >> "$NGINX_CONF"
printf '}\n'                                                                   >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf 'server {\n'                                                            >> "$NGINX_CONF"
printf '    listen 443 ssl;\n'                                                 >> "$NGINX_CONF"
printf '    server_name %s;\n' "$DOMAIN"                                       >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf '    ssl_certificate     /etc/letsencrypt/live/%s/fullchain.pem;\n' "$DOMAIN"  >> "$NGINX_CONF"
printf '    ssl_certificate_key /etc/letsencrypt/live/%s/privkey.pem;\n' "$DOMAIN"    >> "$NGINX_CONF"
printf '    ssl_protocols       TLSv1.2 TLSv1.3;\n'                           >> "$NGINX_CONF"
printf '    ssl_ciphers         HIGH:!aNULL:!MD5;\n'                          >> "$NGINX_CONF"
printf '    ssl_session_cache   shared:SSL:10m;\n'                             >> "$NGINX_CONF"
printf '    ssl_session_timeout 10m;\n'                                        >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf '    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\n' >> "$NGINX_CONF"
printf '    add_header X-Frame-Options DENY always;\n'                         >> "$NGINX_CONF"
printf '    add_header X-Content-Type-Options nosniff always;\n'               >> "$NGINX_CONF"
printf '    add_header Referrer-Policy strict-origin-when-cross-origin always;\n' >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf '    location /_next/static/ {\n'                                       >> "$NGINX_CONF"
printf '        proxy_pass http://app:3000;\n'                                 >> "$NGINX_CONF"
printf '        add_header Cache-Control "public, max-age=31536000, immutable";\n' >> "$NGINX_CONF"
printf '    }\n'                                                               >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf '    location /api/ {\n'                                                >> "$NGINX_CONF"
printf '        limit_req zone=api burst=20 nodelay;\n'                        >> "$NGINX_CONF"
printf '        proxy_pass http://app:3000;\n'                                 >> "$NGINX_CONF"
printf '        proxy_http_version 1.1;\n'                                     >> "$NGINX_CONF"
printf '        proxy_set_header Host $host;\n'                                >> "$NGINX_CONF"
printf '        proxy_set_header X-Real-IP $remote_addr;\n'                   >> "$NGINX_CONF"
printf '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n' >> "$NGINX_CONF"
printf '        proxy_set_header X-Forwarded-Proto $scheme;\n'                 >> "$NGINX_CONF"
printf '    }\n'                                                               >> "$NGINX_CONF"
printf '\n'                                                                    >> "$NGINX_CONF"
printf '    location / {\n'                                                    >> "$NGINX_CONF"
printf '        proxy_pass http://app:3000;\n'                                 >> "$NGINX_CONF"
printf '        proxy_http_version 1.1;\n'                                     >> "$NGINX_CONF"
printf '        proxy_set_header Upgrade $http_upgrade;\n'                     >> "$NGINX_CONF"
printf '        proxy_set_header Connection upgrade;\n'                        >> "$NGINX_CONF"
printf '        proxy_set_header Host $host;\n'                                >> "$NGINX_CONF"
printf '        proxy_set_header X-Real-IP $remote_addr;\n'                   >> "$NGINX_CONF"
printf '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n' >> "$NGINX_CONF"
printf '        proxy_set_header X-Forwarded-Proto $scheme;\n'                 >> "$NGINX_CONF"
printf '        proxy_read_timeout 60s;\n'                                     >> "$NGINX_CONF"
printf '    }\n'                                                               >> "$NGINX_CONF"
printf '}\n'                                                                   >> "$NGINX_CONF"

$COMPOSE stop nginx
$COMPOSE up -d nginx

echo ""
echo "Done! Site is live at https://$DOMAIN"
