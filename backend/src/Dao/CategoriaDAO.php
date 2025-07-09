<?php

namespace Garden\Dao;

use PDO;
use Garden\Core\Database;
use Garden\Models\Categoria;


class CategoriaDAO
{
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

            return $stmt->fetchAll(PDO::FETCH_ASSOC, Categoria::class);
        } catch (\PDOException $e) {
            return [];
        }
    }

    public function buscarPorId(int $id): ?array
    {
       try {
            $sql = 'SELECT * FROM categorias WHERE id_categoria = :id';
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $stmt->setFetchMode(PDO::FETCH_CLASS, Categoria::class);
            
            $resultado = $stmt->fetch();
            return $resultado ?: null;
        } catch (\PDOException $e) {
            return null;
        }
    }

    public function criar(Categoria $categoria): int|false
    {
        try {
            $sql = 'INSERT INTO categorias (nome_categoria) VALUES (:nome_categoria)';
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':nome_categoria', $categoria['nome_categoria']);

            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function atualizar(Categoria $categoria): bool
    {
        try {
            $sql = 'UPDATE categorias SET nome_categoria = :nome_categoria WHERE id_categoria = :id_categoria';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':nome_categoria', $categoria->getNomeCategoria());
            $stmt->bindValue(':id_categoria', $categoria->getId(), PDO::PARAM_INT);
            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function deletar(int $id): bool {
        try {
            $sql = 'DELETE FROM categorias WHERE id_categoria = :id';
            
            $stmt = $this->conn->prepare($sql); 
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }
}
