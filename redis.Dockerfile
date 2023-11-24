# Use the official Redis image as the base image
FROM redis/redis-stack:latest

# Expose the necessary ports
EXPOSE 6379
EXPOSE 8001