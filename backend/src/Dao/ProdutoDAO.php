<?php

namespace Garden\DAO;
use Garden\Core\Database;
use Garden\Models\Produto;
use PDO;

class ProdutoDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function listarTodos(): array
    {
        $sql = "SELECT 
                    p.id_produto,
                    p.id_categoria,
                    c.nome_categoria,
                    p.nome_produto,
                    p.descricao,
                    p.preco,
                    p.criado_em,
                    p.imagem_url,
                    p.atualizado_em
                FROM produtos p
                JOIN categorias c ON p.id_categoria = c.id_categoria
                ORDER BY p.id_produto ASC";

        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPorId(int $id): ?Produto
    {
        $sql = "SELECT 
                    p.id_produto,
                    p.id_categoria,
                    c.nome_categoria,
                    p.nome_produto,
                    p.descricao,
                    p.preco,
                    p.criado_em,
                    p.imagem_url,
                    p.atualizado_em
                FROM produtos p
                JOIN categorias c ON p.id_categoria = c.id_categoria
                WHERE p.id_produto = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['id' => $id]);

        $dados = $stmt->fetch(PDO::FETCH_ASSOC);
        return $dados ? $this->mapProduto($dados) : null;
    }

    public function criar(array $produto): int|string|false
    {
        $check = $this->conn->prepare("SELECT id_produto FROM produtos WHERE nome_produto = :nome");
        $check->execute(['nome' => $produto['nome_produto']]);
        if ($check->fetch()) {
            return 'conflict';
        }

        $sql = "INSERT INTO produtos (id_categoria, nome_produto, descricao, preco, imagem_url)
                VALUES (:id_categoria, :nome_produto, :descricao, :preco, :imagem_url)";

        $stmt = $this->conn->prepare($sql);
        $ok = $stmt->execute([
            'id_categoria' => $produto['id_categoria'],
            'nome_produto' => $produto['nome_produto'],
            'descricao' => $produto['descricao'] ?? '',
            'preco' => $produto['preco'],
            'imagem_url' => $produto['imagem_url'] ?? ''
        ]);

        return $ok ? $this->conn->lastInsertId() : false;
    }

    public function atualizar(int $id, array $produto): bool|string
    {
        $check = $this->conn->prepare("SELECT id_produto FROM produtos WHERE nome_produto = :nome AND id_produto != :id");
        $check->execute(['nome' => $produto['nome_produto'], 'id' => $id]);
        if ($check->fetch()) {
            return 'conflict';
        }

        $sql = "UPDATE produtos 
                SET id_categoria = :id_categoria,
                    nome_produto = :nome_produto,
                    descricao = :descricao,
                    preco = :preco,
                    imagem_url = :imagem_url
                WHERE id_produto = :id";

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'id_categoria' => $produto['id_categoria'],
            'nome_produto' => $produto['nome_produto'],
            'descricao'    => $produto['descricao'] ?? '',
            'preco'        => $produto['preco'],
            'id'           => $id,
            'imagem_url'        => $produto['imagem_url'] ?? ''
        ]);
    }

    public function deletar(int $id): bool
    {
        $sql = "DELETE FROM produtos WHERE id_produto = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }
     private function mapProduto(array $dados):Produto
    {
        return new Produto(
            idProduto: $dados['id_produto'],
            idCategoria: $dados['id_categoria'],
            nomeProduto: $dados['nome_produto'],
            preco: (float)$dados['preco'],
            descricaoTexto: $dados['descricao'] ?? '',
            imagemUrl: $dados['imagem_url'] ?? null,
            criadoEm: $dados['criado_em'],
            atualizadoEm: $dados['atualizado_em']
        );
    }
    public function buscarPrimeiro() {
        $sql = "SELECT id_produto, nome_produto, id_categoria, preco, descricao, imagem_url 
                FROM produtos 
                ORDER BY id_produto ASC 
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($resultado) {
            $produto = new Produto(
            (int)$resultado['id_produto'],
            (int)$resultado['id_categoria'],
            $resultado['nome_produto'],
            (float)$resultado['preco'],
            $resultado['descricao'],
            $resultado['imagem_url']
            );
            
            return $produto;
        }

    }
}
