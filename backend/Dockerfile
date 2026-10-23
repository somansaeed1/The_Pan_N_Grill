# Backend API image (Express + PostgreSQL driver).
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install dependencies first so this layer is cached until package files change.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

# Run as the unprivileged "node" user that ships with the image.
USER node

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/api/health || exit 1

CMD ["node", "src/server.js"]
