FROM node:14

WORKDIR /opt/client

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000
CMD yarn dev