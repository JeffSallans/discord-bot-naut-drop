FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 443 443

CMD [ "npm", "start" ]
