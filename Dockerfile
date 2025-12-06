# Build stage
FROM gradle:8.5-jdk17-alpine AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY src ./src
RUN gradle build --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the jar file
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Azure Container Apps uses PORT env var
ENV PORT=8080

ENTRYPOINT ["java", "-Xmx512m", "-jar", "/app/app.jar"]