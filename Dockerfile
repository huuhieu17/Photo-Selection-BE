FROM node:18-alpine


# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ARG MONGO_URI
ARG JWT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_REDIRECT_URI
ARG PORT
ARG ALLOWED_ORIGINS
ENV MONGO_URI=$MONGO_URI \
    JWT_SECRET=$JWT_SECRET \
    GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
    GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
    GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI \
    PORT=$PORT \
    ALLOWED_ORIGINS=$ALLOWED_ORIGINS

# Expose port
EXPOSE $PORT

# Run the backend app
CMD ["npm", "start"]