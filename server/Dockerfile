FROM node:22-alpine
WORKDIR /app

# Install deps first so this layer is cached until package files change
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
