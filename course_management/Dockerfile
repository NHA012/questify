FROM node:20.18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json .
RUN npm install --omit=dev

# Copy source files
COPY . .

# Production image
FROM node:20.18-alpine

# Install PDF processing tools with more robust support
# Use --no-cache to avoid storing APK index locally
RUN apk add --no-cache \
  poppler-utils \
  qpdf \
  ghostscript-fonts \
  fontconfig-dev

# Set working directory
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app .

# Set Node memory limit to avoid OOM issues with large PDF processing
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Command to start the application
CMD [ "npm", "start" ]