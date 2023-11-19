FROM node
WORKDIR /usr/app
COPY ./*.js /usr/app
COPY ./*.json /usr/app
RUN npm install
ENTRYPOINT node /usr/app/index.js