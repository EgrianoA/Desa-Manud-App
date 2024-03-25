# Use an official Node runtime as a parent image
FROM node:21

# Set the working directory in the container
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server

# Install dependencies
COPY package*.json /usr/src/server
RUN npm install

# Bundle app source inside Docker image
COPY . /usr/src/server

# Your app binds to port 3001
EXPOSE 3001

CMD [ "npm", "run", "dev" ]
