# Imagen base más ligera con Python
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instala dependencias necesarias del sistema (para uWSGI y pip)
RUN apt-get update && apt-get install -y build-essential gcc \
    && pip install --no-cache-dir flask uwsgi

# Copia los archivos del proyecto al contenedor
COPY . .

# Expone el puerto 80 (Flask por defecto va en el 5000, pero lo adaptamos)
EXPOSE 80

# Comando para iniciar uWSGI sirviendo app.py y el objeto "app"
CMD ["uwsgi", "--http", "0.0.0.0:80", "--wsgi-file", "app.py", "--callable", "app"]
