<?php

namespace Garden\DAO;

use PDO;

class ProdutoDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = new PDO("mysql:host=localhost;dbname=gardenme;charset=utf8mb4", "root", "");
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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

    public function buscarPorId(int $id): ?array
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

        $produto = $stmt->fetch(PDO::FETCH_ASSOC);
        return $produto ?: null;
    }

    public function criar(array $produto): int|string|false
    {
        $check = $this->conn->prepare("SELECT id_produto FROM produtos WHERE nome_produto = :nome");
        $check->execute(['nome' => $produto['nome_produto']]);
        if ($check->fetch()) {
            return 'conflict';
        }

        $sql = "INSERT INTO produtos (id_categoria, nome_produto, descricao, preco)
                VALUES (:id_categoria, :nome_produto, :descricao, :preco)";

        $stmt = $this->conn->prepare($sql);
        $ok = $stmt->execute([
            'id_categoria' => $produto['id_categoria'],
            'nome_produto' => $produto['nome_produto'],
            'descricao'    => $produto['descricao'] ?? '',
            'preco'        => $produto['preco'],
            'imagem_url'        => $produto['imagem_url'] ?? ''
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
                    preco = :preco
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
}
