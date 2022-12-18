FROM php:apache
ARG UID_GID
COPY ./app /var/www/html
RUN chown -R ${UID_GID} /var/www/html

