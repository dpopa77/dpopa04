FROM node:22-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Default port for your app
ENV PORT=3000

# Start the Node app (OVERRIDES the default entrypoint)
ENTRYPOINT ["node", "app.js"]
