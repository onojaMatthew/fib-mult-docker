FROM node:alpine

WORKDIR /app
COPY ./package.json ./
RUN npm 
COPY . .
CMD [ "npm", "run", "start" ]