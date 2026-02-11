# Imagen base con Java 17
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar el wrapper y archivos necesarios (Para asegurar que se copien los ocultos)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src ./src

# Dar permisos al wrapper y construir
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# --- EL CAMBIO ESTÁ AQUÍ ---
# Renombramos el jar generado a algo genérico para que el CMD siempre lo encuentre
RUN mv target/*.jar target/app.jar

# Exponer el puerto
EXPOSE 8080

# Ejecutar usando el nombre genérico
CMD ["java", "-jar", "target/app.jar"]
