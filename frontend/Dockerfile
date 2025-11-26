# ===== Build stage =====
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Angular in development mode
RUN npm run build -- --project frontend --configuration development

# ===== Run stage =====
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
