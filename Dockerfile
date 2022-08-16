# build application
FROM node:16-alpine AS builder

WORKDIR /tmp/build-env

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --frozen-lockfile

COPY . ./
COPY nuxt.config.ts tsconfig.json ./
RUN npm run build


# build runner image
FROM node:16-alpine AS runner

WORKDIR /usr/local/bin/accessicity
EXPOSE 3000
ENV NODE_ENV=production
CMD npx prisma migrate deploy && npm run start

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --production --frozen-lockfile && npm cache verify

COPY --from=builder /tmp/build-env/.output ./.output
LABEL org.opencontainers.image.source=https://github.com/PassiDel/accessicity
