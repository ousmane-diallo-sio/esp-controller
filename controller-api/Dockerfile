FROM node:alpine3.18

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

CMD [ "yarn", "start" ]