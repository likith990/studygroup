# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite bakes this in at build time (see src/lib/config.js)
ARG VITE_SERVER_URL=http://localhost:8080
ENV VITE_SERVER_URL=$VITE_SERVER_URL
RUN npm run build

# ---- serve stage ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
