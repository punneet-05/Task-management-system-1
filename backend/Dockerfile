FROM node:18-alpine

WORKDIR /usr/src/app

# 1. Copy package files
COPY package*.json ./

# 2. Install deps WITHOUT lifecycle scripts
RUN npm install --ignore-scripts

# 3. Copy full source (includes prisma/schema.prisma)
COPY . .

# 4. Generate Prisma Client
RUN npx prisma generate

# 5. Build
RUN npm run build

EXPOSE 4000

# 6. Run migration at runtime (Render-safe)
CMD sh -c "npx prisma migrate deploy && npm start"
