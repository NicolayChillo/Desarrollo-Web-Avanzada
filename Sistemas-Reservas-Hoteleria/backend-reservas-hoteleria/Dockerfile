# Imagen base con Java 17
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar el proyecto
COPY . .

# Dar permisos al wrapper
RUN chmod +x mvnw

# Construir el proyecto
RUN ./mvnw clean package -DskipTests

# Exponer el puerto (Render lo asigna)
EXPOSE 8080

# Ejecutar la aplicación
CMD ["java", "-jar", "target/*.jar"]
