FROM node:latest
COPY package.json yarn.lock ./
RUN yarn
COPY server.js .
EXPOSE 5000
CMD [ "node", "server.js"]