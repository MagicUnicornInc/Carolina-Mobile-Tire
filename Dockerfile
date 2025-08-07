# Use nginx alpine for production
FROM nginx:alpine

# Install Python for any server-side processing if needed
RUN apk add --no-cache python3 py3-pip

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy website files to nginx html directory
COPY src/ /usr/share/nginx/html/

# Expose port 7100
EXPOSE 7100

# Start nginx
CMD ["nginx", "-g", "daemon off;"]