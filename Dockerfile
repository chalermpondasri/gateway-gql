FROM node:16-alpine as build

WORKDIR /app

COPY --chown=node:node . .
# build
RUN npm ci --silent
RUN npm run build
USER node

FROM node:16-alpine as runner
RUN apk add --no-cache bash
RUN apk --no-cache add curl
USER node
WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
HEALTHCHECK --start-period=30s CMD curl --fail http://localhost:3000/api/health-check || exit 1
CMD [ "node", "dist/main.js" ]
