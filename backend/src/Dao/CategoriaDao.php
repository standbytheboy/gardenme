<?php

namespace Garden\Dao;

use PDO;
use Garden\core\Database;
use Garden\models\Categoria;


class CategoriaDao {
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function listarTodos(): array
    {
        try {
            $sql = 'SELECT * FROM categorias ORDER BY nome_categoria ASC';

            $stmt = $this->conn->query($sql);
            $stmt->execute();

            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $categorias = [];

            foreach ($listaDeDados as $dados) {
                $categorias[] = $this->mapCategoria($dados);
            }
            return $categorias;
        } catch (\PDOException $e) {
            return [];
        }
    }
    

    public function buscarPorId(int $id): ?Categoria
    {
        try {
            $sql = 'SELECT * FROM categorias WHERE id_categoria = :id';

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            return $dados ? $this->mapCategoria($dados) : null;
        } catch (\PDOException $e) {
            return null;
        }
    }

    public function criar(Categoria $categoria): int|false|string
    {
        try {
            $sql = 'INSERT INTO categorias (nome_categoria) VALUES (:nome_categoria)';

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':nome_categoria', $categoria->getNomeCategoria());
            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                return 'conflict'; 
            }
            return false;
        }
    }

    public function atualizar(Categoria $categoria): bool|string
    {
        try {
            $sql = 'UPDATE categorias SET nome_categoria = :nome_categoria WHERE id_categoria = :id_categoria';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':nome_categoria', $categoria->getNomeCategoria());
            $stmt->bindValue(':id_categoria', $categoria->getId(), PDO::PARAM_INT);
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
            $sql = 'DELETE FROM categorias WHERE id_categoria = :id';

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            return false;
        }
    }

    private function mapCategoria(array $dados): Categoria
    {
        return new Categoria(
            idCategoria: $dados['id_categoria'],
            nomeCategoria: $dados['nome_categoria'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em']
        );
    }
}
