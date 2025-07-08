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
                    
            $conn = \Garden\Core\Database::getInstance();
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
            return $resultado ?: null;
        } catch (\PDOException $e) {
            return null;
        }
    }
}