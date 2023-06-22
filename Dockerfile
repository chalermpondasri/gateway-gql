# build app
FROM node:16-alpine as development

WORKDIR /app

## install deps
COPY package.json .

# prebuild
COPY .eslintrc.js .
COPY tsconfig.build.json .
COPY nest-cli.json .
COPY tslint.json .

# build
COPY tsconfig.json .
COPY src .
RUN npm install --silent && npm run build