# Use an official Node runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build the application
RUN npm run build

# Your app binds to port 3001
EXPOSE 3001

CMD [ "node", "start" ]