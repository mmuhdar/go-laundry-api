# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /go-laundry

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

USER node

# Install the required packages
RUN npm install

RUN npm run build

# Copy the rest of the application code to the container
COPY . .

# Specify the command to run when the container launches
CMD ["npm", "run", "start:prod"]