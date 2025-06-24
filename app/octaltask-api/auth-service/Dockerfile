# Stage 1: Build 
FROM node:22-alpine AS builder

# dir vào thư mục app để cài đặt dependencies
WORKDIR /app

# Copy từ thư mục gốc vào thư mục app
COPY . .

# Cài toàn bộ dependencies tại root
RUN npm install
RUN npm run build

# Stage 2: chạy ứng dụng
FROM node:22-alpine

# Tạo user không phải root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

USER appuser

EXPOSE 50051
CMD ["node", "dist/main.js"]
#