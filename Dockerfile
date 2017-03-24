# Use the latest LTS (long term support) version 'boron' of node available from the Docker Hub
FROM node:boron

# Create a non-root user to increase security in case of container breakout
RUN groupadd -r nodejs \
   && useradd -m -r -g nodejs nodejs

USER nodejs

# Create directory to hold the application code
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# App runs on this port by default
EXPOSE 8080
CMD [ "npm", "start" ]