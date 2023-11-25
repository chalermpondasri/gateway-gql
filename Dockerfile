FROM node:16-alpine as build

WORKDIR /app

COPY --chown=node:node . .
# build
RUN npm ci --silent
RUN npm run build
USER node

FROM node:16-alpine as runner

USER node
WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
CMD [ "node", "dist/main.js" ]
