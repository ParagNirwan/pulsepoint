# ===== BUILD STAGE =====
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Download dependencies only
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Package the app (skip tests)
RUN mvn clean package -DskipTests

# ===== RUN STAGE =====
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy compiled JAR from build stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Run with preview features enabled
ENTRYPOINT ["java", "--enable-preview", "-jar", "app.jar"]