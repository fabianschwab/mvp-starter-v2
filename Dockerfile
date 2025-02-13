FROM node:alpine3.20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY .env.example .env
RUN npm run build
RUN npm prune --production

FROM node:alpine3.20
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
