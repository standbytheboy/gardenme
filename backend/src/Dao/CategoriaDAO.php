<?php

namespace Garden\Dao;

use PDO;
use Garden\Core\Database;

class Categoria {
    private PDO $conn;

    public function __construct() {
        $this->conn = Database::getInstance();
    }
    
    public function listarTodos(): array {
            $sql = 'SELECT * FROM categorias ORDER BY nome_categoria ASC';

            $stmt = $this->conn->query($sql);

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

    public function buscarPorId(int $id): ?array {
        $sql = 'SELECT * FROM categorias WHERE id_categoria = :id';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        return $resultado ?: null;
        }

    public function criar(array $dados) {
            $sql = 'INSERT INTO categorias (nome_categoria) VALUES (:nome_categoria)';
        

        try {
            $conn = \Garden\Core\Database::getInstance();
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':nome_categoria', $dados['nome_categoria']);

            $stmt->execute();
            return $conn->lastInsertId(); 
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function atualizar(int $id, array $dados) {
        $sql = 'UPDATE categorias SET nome_categoria = :nome_categoria WHERE id_categoria = :id';
        
        try {
            $conn = \Garden\Core\Database::getInstance();
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':nome_categoria', $dados['nome_categoria']);

            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function excluir($id): bool {
        $sql = 'DELETE FROM categorias WHERE id_categoria = :id';

        try {
            $conn = \Garden\Core\Database::getInstance();
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return$stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }
}