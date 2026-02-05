FROM node:18-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD sh -c "npx prisma migrate deploy && npm start"
