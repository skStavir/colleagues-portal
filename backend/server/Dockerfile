FROM node
WORKDIR /usr/app
COPY ./*.js /usr/app
COPY ./*.json /usr/app
COPY config config
RUN npm install

EXPOSE 3000

ENTRYPOINT node /usr/app/index.js