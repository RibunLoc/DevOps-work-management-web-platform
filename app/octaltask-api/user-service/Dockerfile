FROM node:20

WORKDIR /app

# Copies package.json and package-lock.json files
COPY user-service-package.json ./package.json
COPY user-service-package-lock.json ./package-lock.json
# Installs based on root files
RUN npm install -g @nestjs/cli && npm install
# Copy all the project to the working directory
COPY . .

RUN npm run build

# The command below can be replaced by "npm run start"
CMD ["node", "dist/main"]