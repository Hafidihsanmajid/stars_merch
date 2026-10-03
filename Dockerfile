# Multi-stage Dockerfile for Stars Merch Web Application (Next.js + Tailwind CSS)
# ==========================================
# Stage 1: Builder (Full build environment & asset compilation)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install compilation prerequisites for Alpine
RUN apk add --no-cache libc6-compat

# Copy package manifests first to leverage Docker layer caching
COPY frontend/package.json frontend/package-lock.json ./

# Install all dependencies (including devDependencies required for Tailwind CSS & TypeScript)
RUN npm ci --prefer-offline

# Copy application source code
COPY frontend/ ./

# Disable telemetry and set production build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile Next.js pages and bundle Tailwind CSS into standalone output
RUN npm run build

# ==========================================
# Stage 2: Production (Ultra-lightweight Alpine runtime)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install minimal runtime library needed for Alpine compatibility
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create secure non-root user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets for public access
COPY --from=builder /app/public ./public

# Prepare Next.js cache directory with appropriate ownership
RUN mkdir .next && chown nextjs:nodejs .next

# Copy ONLY compiled standalone server and static assets (no raw sources or devDependencies)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Start production standalone server
CMD ["node", "server.js"]
