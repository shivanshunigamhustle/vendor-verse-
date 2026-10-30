# Build stage: compile the Vite app
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage: static files behind nginx
FROM nginx:1.27-alpine
# nginx image fills ${PORT} in templates at start; Render sets PORT, default 80 elsewhere
ENV PORT=80
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1:${PORT}/ >/dev/null || exit 1
