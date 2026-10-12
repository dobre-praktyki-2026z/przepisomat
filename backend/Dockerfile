FROM node:26-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /app/data && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/recipes.db

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "src/index.ts"]
