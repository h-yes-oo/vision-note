FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g npm@8.1.2

RUN npm install

COPY ./ ./

CMD ["npm", "run", "start"]