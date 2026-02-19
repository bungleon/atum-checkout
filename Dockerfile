FROM eteam/base:node-alpine14-eks
RUN apk update && apk upgrade && apk add --no-cache \
	git

WORKDIR /app
RUN chown node:node /app
COPY --chown=node:node . /app
USER node
RUN npm run build
CMD ["npm", "start"]