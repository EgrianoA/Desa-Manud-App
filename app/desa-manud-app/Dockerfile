# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your Next.js app's source code
COPY . .

# Next.js listens on port 4000 by default, but you can configure a different port
EXPOSE 4000

# Build and run the app in production mode
CMD ["npm", "run", "build"]
CMD ["npm", "start"]