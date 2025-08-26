# Estágio 1: Build da aplicação React
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor de produção com Nginx
FROM nginx:stable-alpine
# Copia os arquivos de build do estágio anterior para o diretório do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copia o arquivo de configuração customizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]