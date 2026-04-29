FROM eclipse-temurin:21-jdk-alpine

COPY build/libs/*.jar /opt/apuntar/apuntar.jar

ENTRYPOINT ["java", "-Duser.timezone=America/Argentina/Buenos_Aires", "/opt/apuntar/apuntar.jar"]