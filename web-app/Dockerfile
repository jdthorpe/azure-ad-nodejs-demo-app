# https://github.com/AzureAD/passport-azure-ad/issues/423#issuecomment-586457072
FROM node:12.16.0-stretch
COPY package.json yarn.lock  ./
RUN yarn
COPY views/ ./views
COPY config.js app.js ./
EXPOSE 80
CMD [ "node", "app.js"]