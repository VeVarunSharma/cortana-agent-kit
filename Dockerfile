# Use an official Node.js runtime as a parent image
FROM node:18-slim AS build

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
FROM node:18-slim AS production

WORKDIR /usr/src/app

# Copy production dependencies from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json


# Copy the compiled JavaScript files
COPY --from=build /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/index.js"]
