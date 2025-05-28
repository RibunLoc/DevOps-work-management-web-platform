# 1. Build Stage
# ========================
FROM node:18-alpine AS builder

# thiết lập môi trường làm việc
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source files
COPY . .

RUN npm run build


# 2. Production Stage
#=========================
FROM nginx:stable-alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy shell script to generate env.js
COPY docker-entrypoint.sh  /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port (default Vite is 5173, but in prod it's usually 80)
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]

