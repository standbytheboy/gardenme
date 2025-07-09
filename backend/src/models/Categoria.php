<?php

namespace Garden\Models;

use PDO;
use Garden\Core\Database;

class Categoria {
    public function listarTodos(): array {
        try {
            $conn = \Garden\Core\Database::getInstance();

            $sql = 'SELECT
                    id_categoria,
                    nome_categoria,
                    criado_em,
                    atualizado_em
                    FROM
                    categorias
                    ORDER BY
                    nome_categoria ASC';

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            return [];
        }
    }

    public function buscarPorId(int $id): ?array {
        try {
            $conn = \Garden\Core\Database::getInstance();

            $sql = 'SELECT
                    id_categoria,
                    nome_categoria,
                    criado_em,
                    atualizado_em
                    FROM
                    categorias
                    WHERE
                    id_categoria = :id';

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
            return $resultado ?: null;
        } catch (\PDOException $e) {
            return null;
        }
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