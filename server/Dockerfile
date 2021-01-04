FROM node:14

WORKDIR /opt/server

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 5000
CMD node app