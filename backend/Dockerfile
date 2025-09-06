# backend/Dockerfile

FROM php:8.2-apache

# Instala extensões PHP necessárias
RUN docker-php-ext-install pdo pdo_mysql

# Habilita o mod_rewrite do Apache
RUN a2enmod rewrite

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho
WORKDIR /var/www/html

# Altera a configuração do Apache para apontar para a pasta public
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Copia os arquivos do backend
COPY . /var/www/html

# Instala as dependências do Composer
RUN composer install

# Define as permissões corretas
RUN chown -R www-data:www-data /var/www/html