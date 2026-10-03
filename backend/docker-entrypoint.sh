#!/bin/bash
set -e

# If .env does not exist, copy from .env.example or create it
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "[Backend Entrypoint] Copying .env.example to .env..."
        cp .env.example .env
    else
        echo "[Backend Entrypoint] Creating basic .env..."
        touch .env
    fi
fi

# Ensure storage and bootstrap cache directories exist with correct permissions
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache || true

# Generate application key if not set
if ! grep -q "^APP_KEY=base64:" .env && [ -z "$APP_KEY" ]; then
    echo "[Backend Entrypoint] Generating Laravel APP_KEY..."
    php artisan key:generate --force
fi

# Wait for MySQL if DB_HOST is configured
if [ "$DB_CONNECTION" = "mysql" ] && [ -n "$DB_HOST" ]; then
    echo "[Backend Entrypoint] Waiting for database at $DB_HOST:${DB_PORT:-3306}..."
    max_tries=30
    counter=0
    until php -r "
        try {
            new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: '3306') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
            exit(0);
        } catch (\Throwable \$e) {
            exit(1);
        }
    " 2>/dev/null; do
        counter=$((counter + 1))
        if [ $counter -gt $max_tries ]; then
            echo "[Backend Entrypoint] Error: Database connection timed out after $max_tries attempts."
            exit 1
        fi
        sleep 2
    done
    echo "[Backend Entrypoint] Database is ready!"

    echo "[Backend Entrypoint] Running database migrations..."
    php artisan migrate --force

    echo "[Backend Entrypoint] Running database seeders..."
    php artisan db:seed --force
fi

# Clear cached config/routes
php artisan config:clear
php artisan route:clear

echo "[Backend Entrypoint] Starting Laravel API server..."
exec "$@"
