# stage 1: Build
FROM node:22-alpine AS builder 

# Tạo user group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Tạo thư mục làm việc và cấp quyền cho appuser trước khi chuyển user
WORKDIR /app
RUN chown -R appuser:appgroup /app

# Chuyển sang user appuser
USER appuser

# Copy package files và cài đặt dependencies
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci

# Copy source code
COPY . .
RUN npm run build

# stage 2: Server nginx
FROM nginx:1.25-alpine

# tạo thư mục chưa file runtime 
RUN mkdir -p /usr/share/nginx/html

# Copy nginx.conf và entrypoint 
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Cấp quyên thực thi
RUN chmod +x /docker-entrypoint.sh

# Copy build
COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
#