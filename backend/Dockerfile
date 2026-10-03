# Multi-stage Dockerfile for Laravel Backend API
# ==========================================
# Stage 1: Builder (Full tools for Composer dependencies & vendor optimization)
# ==========================================
FROM php:8.2-cli-alpine AS builder

WORKDIR /var/www/html

# Install build dependencies and tools needed by Composer
RUN apk add --no-cache \
    git \
    unzip \
    curl

# Copy Composer binary from official Composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy composer definition files first to leverage layer caching
COPY composer.json composer.lock ./

# Install production dependencies only (exclude devDependencies like phpunit, faker, sail, pint)
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts \
    --no-progress

# Copy backend source code to generate optimized classmaps
COPY . .

# Generate production-optimized autoloader classmaps
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# ==========================================
# Stage 2: Production (Ultra-lightweight runtime)
# ==========================================
FROM php:8.2-cli-alpine AS runner

WORKDIR /var/www/html

# Install only minimal runtime system packages & PHP extensions
# (No build tools like git, curl, unzip, or composer binary in the final image)
RUN apk add --no-cache \
    bash \
    mysql-client \
    && docker-php-ext-install pdo_mysql bcmath \
    && rm -rf /var/cache/apk/* /tmp/*

# Set production environment flags
ENV APP_ENV=production
ENV APP_DEBUG=false

# Copy only production application files from builder (discarding tests, dev configs, and raw files)
COPY --from=builder /var/www/html/app ./app
COPY --from=builder /var/www/html/bootstrap ./bootstrap
COPY --from=builder /var/www/html/config ./config
COPY --from=builder /var/www/html/database ./database
COPY --from=builder /var/www/html/public ./public
COPY --from=builder /var/www/html/resources ./resources
COPY --from=builder /var/www/html/routes ./routes
COPY --from=builder /var/www/html/storage ./storage
COPY --from=builder /var/www/html/artisan ./artisan
COPY --from=builder /var/www/html/composer.json ./composer.json
COPY --from=builder /var/www/html/.env.example ./.env.example
COPY --from=builder /var/www/html/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Copy strictly optimized production vendor dependencies from builder
COPY --from=builder /var/www/html/vendor ./vendor

# Normalize line endings, configure permissions, and setup entrypoint
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
