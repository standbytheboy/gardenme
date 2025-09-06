-- init.sql (Versão Completa com Dados)

CREATE DATABASE IF NOT EXISTS gardenme CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gardenme;

-- Tabela de Categorias de Produtos
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Status dos Pedidos
CREATE TABLE status (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Usuários
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    celular VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    caminho_foto_perfil VARCHAR(255) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabela de Endereços (ligada ao usuário)
CREATE TABLE endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    apelido VARCHAR(50),
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    complemento VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela de Produtos (ligada a categorias)
CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    imagem_url VARCHAR(255) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Tabela de Dicas
CREATE TABLE dicas (
    id_dica INT AUTO_INCREMENT PRIMARY KEY,
    titulo_dica VARCHAR(255) NOT NULL,
    conteudo_dica TEXT NOT NULL,
    id_produto INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabela de Estoque (ligada a produtos)
CREATE TABLE estoque (
    id_estoque INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL UNIQUE,
    quantidade_disponivel INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela Principal de Pedidos
CREATE TABLE ordem_de_pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_endereco INT NOT NULL,
    id_status INT NOT NULL,
    preco_total DECIMAL(10, 2) NOT NULL,
    valor_frete DECIMAL(10, 2) NOT NULL,
    codigo_rastreio VARCHAR(100),
    pagamento_metodo VARCHAR(50),
    pagamento_status VARCHAR(50),
    pagamento_transacao_id VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco) ON DELETE RESTRICT,
    FOREIGN KEY (id_status) REFERENCES status(id_status) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Tabela de Itens de um Pedido
CREATE TABLE itens_do_pedido (
    id_itens_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES ordem_de_pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =================================================================
--  POPULANDO TABELAS (CONTEÚDO DO SEEDS.SQL)
-- =================================================================

INSERT INTO status (descricao) VALUES
('Pendente'), ('Aguardando Pagamento'), ('Processando'), ('Enviado'), ('Entregue'), ('Cancelado');

INSERT INTO categorias (nome_categoria) VALUES
('Plantas Ornamentais'), ('Flores Raras'), ('Suculentas'), ('Cactos'), ('Árvores em Miniatura'), ('Ervas Aromáticas'), ('Plantas Frutíferas'), ('Samambaias'), ('Orquídeas'), ('Trepadeiras'), ('Plantas de Folhagem'), ('Plantas Medicinais');

INSERT INTO produtos (id_categoria, nome_produto, descricao, preco, imagem_url) VALUES
(3, 'Suculenta Echeveria', 'Suculenta popular de fácil cuidado, em vaso de cerâmica.', 25.50, 'https://cdn.awsli.com.br/2500x2500/2429/2429322/produto/243925415/img_20241018_113008-tdwtu0bmzb.jpg'),
(4, 'Cacto Mandacaru Pequeno', 'Muda de cacto Mandacaru, ideal para decoração interna.', 35.00, 'https://veiling.com.br/wp-content/uploads/2025/06/cactus-mandacaru-683f315168ad6.jpg'),
(9, 'Orquídea Phalaenopsis Branca', 'Orquídea elegante com flores brancas duradouras.', 75.90, 'https://cdn.awsli.com.br/2500x2500/2446/2446161/produto/211153233/fotor_2023-4-3_18_23_13-huagyk.jpg'),
(6, 'Muda de Manjericão', 'Erva aromática para temperos, pronta para colher.', 15.00, 'https://acdn-us.mitiendanube.com/stores/002/168/613/products/manjericao-verde-2-min1-d12441cea4f6be728116902323382484-1024-1024.png'),
(11, 'Costela-de-Adão (Monstera)', 'Planta de folhagem exuberante, ideal para ambientes internos.', 99.90, 'https://agrojardim.cdn.magazord.com.br/img/2025/03/produto/2581/planta-costela-de-aDao-ambiente-1-agrojardim.png?ims=fit-in/650x650/filters:fill(white)'),
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

INSERT INTO estoque (id_produto, quantidade_disponivel) VALUES
(1, 50), (2, 30), (3, 25), (4, 80), (5, 15), (6, 10), (7, 40), (8, 35);

INSERT INTO dicas (titulo_dica, conteudo_dica, id_produto) VALUES
('Rega para Echeveria', 'Suculentas armazenam água. Regue apenas quando o solo estiver completamente seco para evitar o apodrecimento das raízes. No inverno, reduza a frequência.', 1),
('Luz Solar para Suculentas', 'Echeverias amam luz. Posicione-a em um local que receba pelo menos 6 horas de sol direto por dia para manter suas cores vibrantes.', 1),
('Cuidado com Cactos', 'Cactos como o Mandacaru precisam de pouquíssima água. Regue a cada 15-20 dias no verão e uma vez por mês no inverno. Use um solo bem drenado.', 2),
('Luz Ideal para Orquídeas', 'Orquídeas Phalaenopsis preferem luz indireta e brilhante. Evite sol direto, que pode queimar as folhas. Uma janela voltada para o leste é ideal.', 3),
('Umidade para Orquídeas', 'Para simular o ambiente natural, borrife água nas folhas da sua orquídea nos dias mais quentes e secos.', 3),
('Colheita do Manjericão', 'Para estimular o crescimento, colha as folhas superiores do manjericão regularmente. Isso fará com que a planta crie mais ramos e folhas.', 4),
('Limpeza das Folhas', 'As folhas grandes da Costela-de-Adão podem acumular pó. Limpe-as suavemente com um pano úmido para ajudá-la a respirar e fazer fotossíntese melhor.', 5),
('Tutor para Monstera', 'Para um crescimento vertical e saudável, considere adicionar um tutor (estaca de musgo) no vaso para que a planta possa se apoiar.', 5),
('Poda de Manutenção do Bonsai', 'Pode regularmente os galhos e folhas do seu Bonsai para manter a forma desejada e estimular um crescimento mais denso e compacto.', 6),
('Mantenha a Umidade', 'Samambaias amam umidade. Mantenha o solo sempre levemente úmido (mas não encharcado) e borrife água nas folhas com frequência.', 7),
('Floração do Antúrio', 'Para incentivar a floração, mantenha seu Antúrio em um local com boa iluminação indireta e adube com um fertilizante rico em fósforo durante a primavera.', 8),
('A Planta Imortal', 'A Zamioculca é extremamente tolerante a condições de pouca luz e rega infrequente. É a planta perfeita se você esquece de cuidar das suas plantas.', 9),
('Como Propagar Jiboia', 'É muito fácil criar novas mudas! Corte um galho abaixo de um nó (pequena raiz aérea) e coloque-o em um copo com água. Em poucas semanas, novas raízes surgirão.', 10),
('Purificadora de Ar', 'Além de resistente, a Espada-de-São-Jorge é uma das melhores plantas para purificar o ar, removendo toxinas do ambiente. Ótima para quartos!', 11),
('Sol Pleno é Essencial', 'Como o nome sugere, a Rosa do Deserto precisa de muito sol direto. Coloque-a no local mais ensolarado da sua casa para garantir flores lindas.', 12),
('Uso Medicinal da Babosa', 'Para usar o gel, corte uma folha mais antiga da base da planta. O gel é ótimo para aliviar queimaduras de sol e hidratar a pele.', 13),
('Aroma e Sabor', 'O alecrim precisa de sol e pouca água. Esfregue as folhas para liberar seu aroma e use os ramos frescos para temperar pratos e bebidas.', 14),
('Frutos em Vaso', 'Para que seu limoeiro dê frutos em um vaso, garanta que ele receba pelo menos 6-8 horas de sol por dia e adubação regular com um fertilizante para cítricos.', 15),
('Girando sua Pilea', 'Gire sua Pilea a cada poucos dias para que todos os lados recebam luz solar. Isso ajuda a manter seu formato simétrico e evita que ela se incline em direção à janela.', 16);