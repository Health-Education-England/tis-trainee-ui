FROM node:16.17.0-alpine

RUN mkdir /app

COPY . /app

WORKDIR /app

ENV PATH="/app/node_modules/.bin:${PATH}"

COPY package.json ./

COPY next.config.js ./next.config.js

RUN npm install

RUN npm run build

CMD ["npm", "start"]