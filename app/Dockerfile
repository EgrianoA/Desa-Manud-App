# Use an official Node runtime as a parent image
FROM node:21

# Set the working directory in the container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
COPY package*.json /usr/src/app

# Install dependencies
RUN npm install

# Copy the rest of your Next.js app's source code
COPY . /usr/src/app

# Next.js listens on port 3000 by default, but you can configure a different port
EXPOSE 3000

# Build and run the app in production mode
CMD ["npm", "run", "dev"]
