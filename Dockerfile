FROM php:apache
COPY ./app /var/www/html
RUN chown -R www-data:www-data /var/www/html

