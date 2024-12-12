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
ENV PORT=10000

# Start command
CMD ["npm", "start"]