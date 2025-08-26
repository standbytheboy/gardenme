# Estágio 1: Build com Composer
FROM composer:2 as builder
WORKDIR /app
COPY composer.json composer.lock ./
# Adicionado --no-scripts e --no-plugins para um build mais limpo
RUN composer install --no-dev --no-interaction --no-plugins --ignore-platform-reqs

# Estágio 2: Imagem final com Apache e PHP
FROM php:8.2-apache

# Instala extensões PHP
RUN docker-php-ext-install pdo pdo_mysql

# Habilita o mod_rewrite do Apache
RUN a2enmod rewrite

# Copia a nova configuração do Apache para habilitar o .htaccess
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Copia as dependências do Composer
COPY --from=builder /app/vendor/ /var/www/html/vendor/

# Copia o código da aplicação
COPY . /var/www/html/

# Define o diretório de trabalho
WORKDIR /var/www/html