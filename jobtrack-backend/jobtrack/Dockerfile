# Use lightweight Java 17 image
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Give permission to Maven wrapper
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port (Render will override this)
EXPOSE 8080

# Run application (IMPORTANT: dynamic PORT support)
CMD ["sh", "-c", "java -jar target/*.jar --server.port=${PORT}"]