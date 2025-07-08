-- --- INÍCIO DO SCRIPT SQL ---
create database if not exists gardenme;
use gardenme;
-- Tabela de Usuários
-- Armazena as informações dos usuários cadastrados.
CREATE TABLE if not exists `usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `sobrenome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `celular` VARCHAR(20),
  `senha_hash` VARCHAR(255) NOT NULL,
  `data_cadastro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);

-- Tabela de Endereços dos Usuários
-- Cada usuário pode ter um ou mais endereços.
CREATE TABLE if not exists `enderecos` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `apelido` VARCHAR(50),
  `cep` VARCHAR(10) NOT NULL,
  `logradouro` VARCHAR(255) NOT NULL,
  `numero` VARCHAR(20) NOT NULL,
  `complemento` VARCHAR(100),
  `bairro` VARCHAR(100) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `estado` VARCHAR(50) NOT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_endereco`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE
);

-- Tabela de Categorias de Produtos
-- Organiza os produtos em diferentes categorias.
CREATE TABLE if not exists `categorias` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nome_categoria` VARCHAR(100) NOT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nome_categoria_UNIQUE` (`nome_categoria`)
);

-- Tabela de Produtos
-- Armazena as informações detalhadas de cada produto.
CREATE TABLE if not exists `produtos` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `id_categoria` INT NOT NULL,
  `nome_produto` VARCHAR(255) NOT NULL,
  `descricao` TEXT,
  `preco` DECIMAL(10,2) NOT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_produto`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id_categoria`)
);

-- Tabela de Estoque
-- Controla a quantidade disponível de cada produto.
CREATE TABLE if not exists `estoque` (
  `id_estoque` INT NOT NULL AUTO_INCREMENT,
  `id_produto` INT NOT NULL,
  `quantidade_disponivel` INT NOT NULL DEFAULT 0,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estoque`),
  FOREIGN KEY (`id_produto`) REFERENCES `produtos`(`id_produto`) ON DELETE CASCADE
);

-- Tabela de Status do Pedido
-- Define os possíveis status de um pedido (ex: 'Aguardando Pagamento', 'Enviado').
CREATE TABLE if not exists `status` (
  `id_status` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(50) NOT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_status`),
  UNIQUE KEY `descricao_UNIQUE` (`descricao`)
);

-- Tabela de Pedidos (Ordem do Pedido)
-- Armazena as informações gerais de cada pedido realizado.
CREATE TABLE if not exists `ordem_do_pedido` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_status` INT NOT NULL,
  `preco_total` DECIMAL(10,2) NOT NULL,
  `valor_frete` DECIMAL(10,2),
  `data_pedido` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pagamento_metodo` VARCHAR(50),
  `pagamento_status` VARCHAR(50),
  `pagamento_transacao_id` VARCHAR(255),
  `codigo_rastreio` VARCHAR(100),
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pedido`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`),
  FOREIGN KEY (`id_status`) REFERENCES `status`(`id_status`)
);

-- Tabela de Itens do Pedido
-- Detalha quais produtos e em qual quantidade compõem cada pedido.
CREATE TABLE if not exists `itens_do_pedido` (
  `id_itens_pedido` INT NOT NULL AUTO_INCREMENT,
  `id_pedido` INT NOT NULL,
  `id_produto` INT NOT NULL,
  `quantidade` INT NOT NULL,
  `preco_unitario` DECIMAL(10,2) NOT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_itens_pedido`),
  FOREIGN KEY (`id_pedido`) REFERENCES `ordem_do_pedido`(`id_pedido`) ON DELETE CASCADE,
  FOREIGN KEY (`id_produto`) REFERENCES `produtos`(`id_produto`)
);

-- --- FIM DO SCRIPT SQL ---