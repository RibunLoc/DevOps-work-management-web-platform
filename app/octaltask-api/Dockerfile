# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

# Thiết lập biến môi trường 
ARG SERVICE 

# dir vào thư mục app để cài đặt dependencies
WORKDIR /app

# Copy từ thư mục gốc vào thư mục app
COPY . .

# Cài toàn bộ dependencies tại root
RUN npm install

# Di chuyển vào service con để build
WORKDIR /app/${SERVICE}
RUN npm install
RUN npm run build

# Stage chạy ứng dụng
FROM node:22-alpine
ARG SERVICE
ARG PORT

WORKDIR /app

COPY --from=builder /app/${SERVICE}/dist ./dist
COPY --from=builder /app/${SERVICE}/package*.json ./
COPY --from=builder /app/${SERVICE}/node_modules ./node_modules

EXPOSE ${PORT}
CMD ["npm", "run", "start"]

