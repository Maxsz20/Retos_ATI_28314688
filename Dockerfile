# Imagen oficial de Apache (httpd)
FROM httpd:2.4

FROM python:3.11-slim

WORKDIR /app

# Instala Flask
RUN pip install flask

# Copia todo
COPY . .

# Expone el puerto para Flask
EXPOSE 80

# Ejecuta el servidor
CMD ["python", "app.py"]
