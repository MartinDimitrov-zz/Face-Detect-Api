FROM node:12.16.1

WORKDIR /usr/src/face-detect-api

COPY ./ ./

RUN npm install

#RUN npm audit fix

CMD [ "/bin/bash" ]