FROM node:18
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build project
RUN npm run build

# Environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Use the PORT environment variable from Cloud Run
CMD PORT=$PORT npm start