<?php

namespace Garden\Models;
use PDO;
use Garden\Core\Database;

class Usuario {
    public function listarTodos(): array {
        try {
            $conn = \Garden\Core\Database::getInstance();

            $sql = 'SELECT
                        id_usuario,
                        nome,
                        sobrenome,
                        email,
                        criado_em,
                        atualizado_em
                      FROM
                        usuario -- Tabela no singular
                      ORDER BY
                        nome ASC';

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
                        id_usuario,
                        nome,
                        sobrenome,
                        email,
                        criado_em,
                        atualizado_em
                    FROM
                        usuario -- Tabela no singular
                    WHERE
                        id_usuario = :id';
                        
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