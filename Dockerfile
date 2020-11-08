FROM php:apache
COPY ./app /var/www/html
RUN mkdir -p /var/www/html/boards
RUN chown -R www-data:www-data /var/www/html
VOLUME /var/www/html/boards
