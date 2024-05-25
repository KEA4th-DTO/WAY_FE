FROM node:21 AS build
WORKDIR /app
COPY package*.json ./

RUN npm install --force

COPY . .
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built React app from the build stage to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file, if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
