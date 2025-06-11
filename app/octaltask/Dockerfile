FROM node:22-alpine

# Tạo user group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Tạo thư mục làm việc và cấp quyền cho appuser trước khi chuyển user
WORKDIR /app
RUN chown -R appuser:appgroup /app

# Chuyển sang user appuser
USER appuser

# Copy package files và cài đặt dependencies
COPY --chown=appuser:appgroup package.json package-lock.json* ./
RUN npm install

# Copy source code (không cần chown lại nếu đã chown ở trên)
COPY --chown=appuser:appgroup . .
RUN npm run build 

EXPOSE 5173
CMD ["npm", "run", "dev"]
