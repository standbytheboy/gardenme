-- =======================================
-- POPULAÇÃO INICIAL DE DADOS
-- =======================================

-- 1. Categorias de Produtos
INSERT INTO categorias (nome_categoria) VALUES
('Plantas Ornamentais'),
('Flores Raras'),
('Suculentas'),
('Cactos'),
('Árvores em Miniatura');

-- 2. Status dos Pedidos
INSERT INTO status (descricao) VALUES
('Pendente'),
('Processando'),
('Enviado'),
('Entregue'),
('Cancelado');

-- 3. Endereços dos Usuários
INSERT INTO endereco (id_usuario, apelido, cep, logradouro, numero, bairro, cidade, estado, complemento) VALUES
(1, 'Casa', '01000-000', 'Rua das Palmeiras', '123', 'Centro', 'São Paulo', 'SP', 'Apto 12'),
(2, 'Trabalho', '20000-000', 'Avenida das Flores', '456', 'Copacabana', 'Rio de Janeiro', 'RJ', 'Sala 301');

-- 4. Produtos (10 plantas fictícias)
INSERT INTO produtos (id_categoria, nome_produto, descricao, preco) VALUES
(1, 'Ficus Luminosa', 'Planta ornamental de folhas largas que brilham levemente sob luz UV.', 79.90),
(2, 'Orquídea Nebulosa', 'Orquídea rara que exala aroma suave de jasmim ao entardecer.', 129.50),
(1, 'Samambaia Esmeralda', 'Folhagem volumosa em tom verde-esmeralda intenso, ideal para ambientes internos.', 59.00),
(3, 'Suculenta Aurora', 'Pequena suculenta cujas folhas mudam de cor do verde ao lilás com a luz solar.', 25.75),
(5, 'Bonsai Solaris', 'Bonsai de crescimento lento com folhas douradas que se intensificam no verão.', 210.00),
(1, 'Hera Estelar', 'Trepadeira que forma pequenos pontos brancos nas folhas, lembrando estrelas.', 42.90),
(4, 'Cacto Rubi Azul', 'Cacto exótico de espinhos azulados e flores em tons de vermelho vibrante.', 35.20),
(2, 'Lavanda Noturna', 'Variedade de lavanda que floresce principalmente à noite, liberando aroma relaxante.', 68.40),
(1, 'Palmeira Cristalina', 'Mini-palmeira com caule translúcido que reflete a luz ambiente.', 185.00),
(2, 'Rosa Lunar', 'Rosa híbrida de pétalas prateadas que brilham sob a lua cheia.', 150.00);

-- 5. Estoque (quantidade inicial)
INSERT INTO estoque (id_produto, quantidade_disponivel) VALUES
(1, 15),
(2, 10),
(3, 20),
(4, 35),
(5, 5),
(6, 18),
(7, 25),
(8, 12),
(9, 8),
(10, 6);
