FROM node:16-alpine as build

WORKDIR /app

COPY --chown=node:node . .
# build
RUN npm ci --silent
RUN npm run build
USER node

FROM node:16-alpine as runner
ENV NODE_ENV staging
ENV DOTENV_KEY dotenv_key
WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/.env.vault .
USER node
CMD [ "node", "dist/main.js" ]
