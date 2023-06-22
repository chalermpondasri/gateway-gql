# build app
FROM node:16-alpine as development

WORKDIR /app

## install deps
COPY package.json .

# prebuild
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .
COPY src .

# build
RUN npm install --silent && npm run build