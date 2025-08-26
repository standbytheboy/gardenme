# 🌿 **GardenMe**

## Seu Cantinho Verde Online: Plantas Frescas e Dicas de Cuidado para Florescer\!

Bem-vindo ao repositório do **GardenMe**, o seu projeto integrador do Senac\! Desenvolvemos um e-commerce completo para a venda de plantas, com o diferencial de oferecer **dicas e cuidados especiais** para cada espécie, garantindo que a natureza prospere na casa de nossos clientes em São Paulo.

-----

## ✨ **Funcionalidades Principais**

  * **Catálogo Interativo:** Explore uma vasta coleção de plantas, com fotos, descrições detalhadas e informações de estoque.
  * **Dicas de Cuidado Exclusivas:** Cada planta vem com um guia completo de rega, luz, adubação e muito mais, para que seus clientes se tornem verdadeiros pais de planta\!
  * **Jornada de Compra Intuitiva:** Adicione plantas ao carrinho, personalize seu pedido e finalize a compra com facilidade.
  * **Área do Cliente:** Gerencie seu perfil, acompanhe o status de seus pedidos e acesse seu histórico de compras.
  * **Painel Administrativo:** Gerencie o catálogo de plantas, dicas, usuários e pedidos de forma eficiente.
  * **Autenticação Segura:** Sistema de login e cadastro com JWT para garantir a segurança dos dados.

-----

## 🛠️ **Tecnologias Utilizadas**

Este projeto foi construído utilizando uma stack moderna e robusta, demonstrando as habilidades adquiridas no curso:

  * **Frontend:** **React** com **Vite**
      * Desenvolvimento ágil e performático de interfaces de usuário reativas.
      * Gerenciamento de estado intuitivo e componentes reutilizáveis.
  * **Backend:** **PHP Puro**
      * API RESTful robusta e otimizada para a comunicação com o frontend.
      * Controle total sobre a lógica de negócio e segurança.
  * **Banco de Dados:** **MySQL**
      * Armazenamento eficiente e seguro de todos os dados do e-commerce (plantas, usuários, pedidos, dicas).

-----

## 🚀 Como Rodar o Projeto

Você pode rodar o projeto de duas maneiras: localmente (manual) ou com Docker (recomendado).

### **Método 1: Rodando com Docker (Recomendado)**

Este método é mais simples, pois o Docker gerencia todo o ambiente necessário (PHP, Node.js, MySQL, etc.).

#### **Pré-requisitos**

  * **Git**
  * **Docker** e **Docker Compose**

#### **Passos**

1.  **Clone o Repositório:**

    ```bash
    git clone https://github.com/standbytheboy/gardenme
    cd gardenme
    ```

2.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` dentro da pasta `backend` e adicione o seguinte conteúdo. Certifique-se de usar uma chave secreta forte.

    ```
    DB_HOST=db
    DB_NAME=gardenme
    DB_USER=root
    DB_PASS=root
    JWT_SECRET=sua-chave-secreta-forte-aqui
    ```

3.  **Construa e Inicie os Contêineres:**
    Na raiz do projeto, execute o comando:

    ```bash
    docker-compose up -d --build
    ```

    Aguarde o processo ser finalizado. O Docker irá construir as imagens, baixar o MySQL e iniciar todos os serviços.

4.  **Acesse o Projeto:**

      * **Frontend:** `http://localhost:5173/`
      * **API (via proxy):** O frontend já está configurado para se comunicar com a API.
      * **Banco de Dados:** Acessível em `localhost:3306` para clientes de banco de dados.

### **Método 2: Rodando Localmente (Manual)**

#### **Pré-requisitos**

  * **PHP** (versão 8.0+)
  * **Composer**
  * **MySQL Server**
  * **Node.js** (versão 18+) e **npm**
  * Um servidor web como **Apache** ou **Nginx** (XAMPP/WAMP/MAMP são recomendados).

#### **Passos**

1.  **Clone o Repositório:**

    ```bash
    git clone https://github.com/standbytheboy/gardenme
    cd gardenme
    ```

2.  **Configurar o Backend (PHP):**

      * Navegue até a pasta `backend`: `cd backend`
      * Instale as dependências do PHP: `composer install`
      * Crie o banco de dados `gardenme` no seu MySQL.
      * Importe os esquemas do banco de dados executando os arquivos SQL da pasta `backend/database` na ordem correta (`a00.sql`, `a01.sql`, etc.).
      * Crie um arquivo `.env` na raiz da pasta `backend` com as credenciais do seu banco de dados local:
        ```
        DB_HOST=127.0.0.1
        DB_NAME=gardenme
        DB_USER=root
        DB_PASS=
        JWT_SECRET=sua-chave-secreta-aqui
        ```
      * Configure seu servidor web (Apache/Nginx) para apontar a raiz do seu site para a pasta `backend/public`.

3.  **Configurar o Frontend (React):**

      * Em um novo terminal, navegue até a pasta `frontend`: `cd frontend`
      * Instale as dependências: `npm install`.
      * Inicie o servidor de desenvolvimento: `npm run dev`.

4.  **Acesse o Projeto:**

      * Abra seu navegador e acesse a URL fornecida pelo Vite (geralmente `http://localhost:5173/`).

-----

## 👥 **Estrutura do Banco de Dados**

-----

## 👥 **Equipe de Desenvolvimento**

Este projeto foi desenvolvido como parte do Projeto Integrador do Senac por:

  * **Douglas Balbino** - Papel: [Especialista em Backend Core]
  * **Gabriel Aparecido** - Papel: [Especialista em Backend de Lógica de Negócio]
  * **Lucas Morais** - Papel: [Especialista em Frontend]

-----

## 🌟 **Agradecimentos**

Agradecemos ao Senac pela oportunidade e orientação neste projeto desafiador e enriquecedor\!