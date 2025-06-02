# Imagen oficial de Apache (httpd)
FROM httpd:2.4

# Copiamos todos los archivos y carpetas del proyecto al directorio donde Apache sirve los archivos
COPY . /usr/local/apache2/htdocs/

# Exponemos el puerto 80 para acceder al servidor Apache
EXPOSE 80