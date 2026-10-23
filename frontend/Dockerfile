# Frontend image (Next.js). Build context is the repository root, because the app is
# an npm workspace:  docker build -f frontend/Dockerfile .
# (docker compose does this for you.)

# ---- Stage 1: install dependencies and build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm ci

COPY frontend ./frontend

# These are read at build time: standalone output, and the backend address the server
# proxies /api requests to. NEXT_PUBLIC_API_URL=/ makes the browser call the same site.
ARG BACKEND_URL=http://backend:4000
ENV BUILD_STANDALONE=1 \
    BACKEND_URL=$BACKEND_URL \
    NEXT_PUBLIC_API_URL=/ \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build --prefix frontend

# ---- Stage 2: small runtime image ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=build --chown=node:node /app/frontend/.next/standalone ./
COPY --from=build --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=build --chown=node:node /app/frontend/public ./frontend/public

USER node

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

CMD ["node", "frontend/server.js"]
