FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN node_modules/.bin/gulp app

EXPOSE 3000

CMD ["npm", "start"]
