# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
# COPY package*.json ./

# Copy the rest of the application code to the container
COPY . .

# Environtment Variable
ENV DATABASE_URL=""
ENV JWT_SECRET=""
ENV SENDER_MAIL=""
ENV EMAIL_PASS=""

# set port
EXPOSE 3636

# Install the required packages
RUN npm install

RUN npm run build

USER node

# Specify the command to run when the container launches
CMD ["npm", "run", "start:prod"]