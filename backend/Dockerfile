FROM node:18-alpine

WORKDIR /usr/src/app

# 1️⃣ Copy package files
COPY package*.json ./

# 2️⃣ Copy prisma schema BEFORE npm install
COPY prisma ./prisma

# 3️⃣ Install deps (now prisma schema exists)
RUN npm install

# 4️⃣ Copy rest of backend code
COPY . .

# 5️⃣ Build app
RUN npm run build

EXPOSE 4000

# 6️⃣ Run migration at container start (Render Free-safe)
CMD sh -c "npx prisma migrate deploy && npx prisma generate && npm start"
