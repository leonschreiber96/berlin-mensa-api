# Use the official Deno image from Docker Hub
FROM denoland/deno:2.0.2

# Set the working directory in the container
WORKDIR /app

# Copy the server file into the container
COPY ./*.ts /app
COPY ./static /app/static

# Create directories for logs and data inside the container
RUN mkdir -p /app/logs /app/data

# Expose the port that the server listens on
EXPOSE 8002

# Grant necessary permissions: network access, read/write to logs and data
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--unstable-cron", "--allow-write=/app/logs,/app/data", "server.ts"]
