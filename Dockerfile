FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prod

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/server.db

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
