# use official node LTS image from  docker hub
FROM node:18-alpine

# Setting the current working directory into container
WORKDIR /app

# copy package.json and package-lock.json files
COPY package*.json ./

# install all the required dependencies
RUN npm install

# copy all the entire application files into container
COPY . . 

# Build the application
RUN npm run build

# Expose the port on my app is running
EXPOSE 4000:4000

# Start the application in development environment 
CMD [ "npm", "run", "start:dev" ]
