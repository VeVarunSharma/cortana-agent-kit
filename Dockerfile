# Use an official Node.js runtime as a parent image
FROM node:22.11.0-slim AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript project
RUN pnpm build

# --- Production Stage ---
FROM node:22.11.0-slim AS production

WORKDIR /usr/src/app

# Copy production dependencies from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json


# Copy the compiled JavaScript files
COPY --from=build /usr/src/app/dist ./dist

# Declare a build-time argument for the port with a default value
ARG PORT=8000

# Set the PORT environment variable from the ARG.
# This makes it available to your Node.js application (process.env.PORT)
ENV PORT=${PORT}

# Expose the port the app runs on
EXPOSE ${PORT}

# Define the command to run the application
CMD ["node", "dist/index.js"]
