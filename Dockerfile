# Base image
FROM node:18-alpine AS development

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project (except files in .dockerignore)
COPY . .

# Expose the application port
EXPOSE 8002

# Use Nodemon for hot-reloading during development
CMD ["npm", "run", "start:dev"]
