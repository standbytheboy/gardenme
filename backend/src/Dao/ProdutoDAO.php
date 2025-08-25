<?php

namespace Garden\Dao;

use PDO;
use Garden\Core\Database;
use Garden\Models\Produto; // Certifique-se de que este Model exista

class ProdutoDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function listarTodos(): array
    {
        try {
            $sql = 'SELECT * FROM produtos ORDER BY nome_produto ASC';
            $stmt = $this->conn->query($sql);
            $stmt->execute();
            
            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $produtos = [];
            
            foreach ($listaDeDados as $dados) {
                $produtos[] = $this->mapProduto($dados);
            }
            return $produtos;
        } catch (\PDOException $e) {
            return [];
        }
    }

    public function buscarPorId(int $id): ?Produto
    {
        try {
            $sql = 'SELECT * FROM produtos WHERE id_produto = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            return $dados ? $this->mapProduto($dados) : null;
        } catch (\PDOException $e) {
            return null;
        }
    }

    public function criar(Produto $produto): int|false|string
    {
        try {
            $sql = 'INSERT INTO produtos (id_categoria, nome_produto, descricao_texto, preco) 
                    VALUES (:id_categoria, :nome_produto, :descricao_texto, :preco)';
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id_categoria', $produto->getIdCategoria(), PDO::PARAM_INT);
            $stmt->bindValue(':nome_produto', $produto->getNomeProduto());
            $stmt->bindValue(':descricao_texto', $produto->getDescricaoTexto());
            $stmt->bindValue(':preco', $produto->getPreco());
            
            $stmt->execute();
            return (int) $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                return 'conflict';
            }
            return false;
        }
    }

    public function atualizar(Produto $produto): bool|string
    {
        try {
            $sql = 'UPDATE produtos SET id_categoria = :id_categoria, nome_produto = :nome_produto, descricao_texto = :descricao_texto, preco = :preco 
                    WHERE id_produto = :id';
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id_categoria', $produto->getIdCategoria(), PDO::PARAM_INT);
            $stmt->bindValue(':nome_produto', $produto->getNomeProduto());
            $stmt->bindValue(':descricao_texto', $produto->getDescricaoTexto());
            $stmt->bindValue(':preco', $produto->getPreco());
            $stmt->bindValue(':id', $produto->getId(), PDO::PARAM_INT);

            return $stmt->execute();
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                return 'conflict';
            }
            return false;
        }
    }

    public function deletar(int $id): bool
    {
        try {
            $sql = 'DELETE FROM produtos WHERE id_produto = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            return false;
        }
    }

    private function mapProduto(array $dados): Produto
    {
        // Esta implementação depende da sua classe Model Produto
        return new Produto(
            id: $dados['id_produto'],
            idCategoria: $dados['id_categoria'],
            nomeProduto: $dados['nome_produto'],
            descricaoTexto: $dados['descricao_texto'],
            preco: $dados['preco'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em']
        );
    }
}