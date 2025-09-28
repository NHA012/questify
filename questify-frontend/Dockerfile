FROM node:20.18-alpine

WORKDIR /_app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Add debugging commands here
RUN node -v
RUN npm -v
RUN ls -la
RUN cat tsconfig.json

# Run the build
RUN npm run build

# Start the application
CMD ["npm", "run", "start"]