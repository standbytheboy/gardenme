-- =================================================================
--  POPULANDO TABELAS INDEPENDENTES
-- =================================================================

-- Inserindo Status de Pedido
INSERT INTO status (descricao) VALUES
('Pendente'),
('Aguardando Pagamento'),
('Processando'),
('Enviado'),
('Entregue'),
('Cancelado');

-- Inserindo Categorias de Plantas
INSERT INTO categorias (nome_categoria) VALUES
('Plantas Ornamentais'),
('Flores Raras'),
('Suculentas'),
('Cactos'),
('Árvores em Miniatura'),
('Ervas Aromáticas'),
('Plantas Frutíferas'),
('Samambaias'),
('Orquídeas'),
('Trepadeiras'),
('Plantas de Folhagem'),
('Plantas Medicinais');

-- =================================================================
--  POPULANDO TABELAS DEPENDENTES
-- =================================================================

-- Inserindo Produtos (ligados às categorias)
INSERT INTO produtos (id_categoria, nome_produto, descricao, preco, imagem_url) VALUES
(3, 'Suculenta Echeveria', 'Suculenta popular de fácil cuidado, em vaso de cerâmica.', 25.50, 'https://cdn.awsli.com.br/2500x2500/2429/2429322/produto/243925415/img_20241018_113008-tdwtu0bmzb.jpg'),
(4, 'Cacto Mandacaru Pequeno', 'Muda de cacto Mandacaru, ideal para decoração interna.', 35.00, 'https://veiling.com.br/wp-content/uploads/2025/06/cactus-mandacaru-683f315168ad6.jpg'),
(9, 'Orquídea Phalaenopsis Branca', 'Orquídea elegante com flores brancas duradouras.', 75.90, 'https://cdn.awsli.com.br/2500x2500/2446/2446161/produto/211153233/fotor_2023-4-3_18_23_13-huagyk.jpg'),
(6, 'Muda de Manjericão', 'Erva aromática para temperos, pronta para colher.', 15.00, 'https://acdn-us.mitiendanube.com/stores/002/168/613/products/manjericao-verde-2-min1-d12441cea4f6be728116902323382484-1024-1024.png'),
(11, 'Costela-de-Adão (Monstera)', 'Planta de folhagem exuberante, ideal para ambientes internos.', 99.90, 'https://agrojardim.cdn.magazord.com.br/img/2025/03/produto/2581/planta-costela-de-adao-ambiente-1-agrojardim.png?ims=fit-in/650x650/filters:fill(white)'),
(5, 'Bonsai de Ficus', 'Miniatura de árvore Ficus com 3 anos de idade.', 150.00, 'https://images.tcdn.com.br/img/img_prod/1132474/ficus_nerifolia_50_anos_86cm_4084_1_ca7ff2aaaab45137eb1b9844b48a2486.jpg'),
(8, 'Samambaia Americana', 'Clássica samambaia de folhas longas e pendentes.', 45.00, 'https://images.tcdn.com.br/img/img_prod/350075/muda_de_samambaia_americana_cuia_21_8677_1_c9ee18ac0dba75d67921b9d057367bd0.jpg'),
(1, 'Antúrio Vermelho', 'Planta ornamental com flores vermelhas vibrantes.', 55.75, 'https://cdn.dooca.store/117259/products/gtaw9j4qdrwcvs3ke6ocyrrhifwe95qvrpqh.jpg?v=1690400633'),
(11, 'Zamioculca', 'Conhecida como a planta da fortuna, é extremamente resistente e ideal para iniciantes.', 89.90, 'https://images.tcdn.com.br/img/img_prod/350075/muda_de_zamioculca_pote_17_9456_1_404d3186a6ae69abc494461ab3a0eaec.jpeg'),
(10, 'Jiboia (Pothos)', 'Planta trepadeira versátil, pode ser usada como pendente ou em suportes verticais.', 39.90, 'https://urbanjungle.pt/wp-content/uploads/2024/10/Planta-jiboia-epipremnum-aureum-pothos-tutor-coco-600x750.jpg'),
(1, 'Espada-de-São-Jorge', 'Planta purificadora de ar, conhecida por sua resistência e folhas verticais marcantes.', 49.90, 'https://i0.wp.com/pitangafloricultura.com.br/wp-content/uploads/2024/04/5-Razoes-para-Ter-uma-Espada-de-Sao-Jorge-em-Casa.png?resize=1024%2C536&ssl=1'),
(3, 'Rosa do Deserto (Adenium)', 'Aparência de bonsai com flores exuberantes. Gosta de sol pleno.', 65.00, 'https://images.tcdn.com.br/img/img_prod/1339521/rosa_do_deserto_hexagon_gem_dobrada_39819_1_be93f25b21574d4a3383df9d6edc6d63.jpg'),
(12, 'Babosa (Aloe Vera)', 'Famosa por suas propriedades medicinais e fácil de cultivar em casa.', 29.50, 'https://lojacasadasfolhas.com.br/site/wp-content/uploads/2022/03/babosa..jpeg'),
(6, 'Muda de Alecrim', 'Erva aromática com aroma marcante, ótima para temperar carnes e legumes.', 18.00, 'https://www.quintoandar.com.br/guias/wp-content/uploads/2022/05/pexels-karolina-grabowska-4750370-scaled.jpg'),
(7, 'Pé de Limão Siciliano (Muda)', 'Muda de limoeiro siciliano, pode ser cultivada em vasos grandes.', 120.00, 'https://boxloja-std-cdn-r2.minhaboxloja.com/lojas/9s0e9/produtos/b09a12d0-ef79-481d-899a-bb26ef9473a7.png'),
(11, 'Pilea Peperomioides (Planta-chinesa-do-dinheiro)', 'Design único com folhas redondas e achatadas. Muito popular em decoração.', 59.90, 'https://maniadeplantas.com.br/wp-content/uploads/2024/07/pilea-peperomioides-1.jpg');

-- Inserindo Estoque para cada Produto
INSERT INTO estoque (id_produto, quantidade_disponivel) VALUES
(1, 50), -- Suculenta Echeveria
(2, 30), -- Cacto Mandacaru Pequeno
(3, 25), -- Orquídea Phalaenopsis Branca
(4, 80), -- Muda de Manjericão
(5, 15), -- Costela-de-Adão (Monstera)
(6, 10), -- Bonsai de Ficus
(7, 40), -- Samambaia Americana
(8, 35); -- Antúrio Vermelho

INSERT INTO dicas (titulo_dica, conteudo_dica, id_produto) VALUES
('Como Regar Suculentas', 'Suculentas armazenam água. Regue apenas quando o solo estiver completamente seco para evitar o apodrecimento das raízes. No inverno, reduza a frequência.', 1),
('Luz Ideal para Orquídeas', 'Orquídeas Phalaenopsis preferem luz indireta e brilhante. Evite sol direto, que pode queimar as folhas. Uma janela voltada para o leste é ideal.', 3),
('Poda de Manutenção do Bonsai', 'Pode regularmente os galhos e folhas do seu Bonsai para manter a forma desejada e estimular um crescimento mais denso e compacto.', 6),
('Dica de Adubação Geral', 'A maioria das plantas de interior se beneficia de adubação durante a primavera e o verão, que é seu período de crescimento ativo. Siga as instruções do fertilizante.', NULL);