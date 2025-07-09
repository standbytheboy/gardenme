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

    public function buscarPorEmail(string $email): ?array {
        try {
            $conn = \Garden\Core\Database::getInstance();

            $sql = 'SELECT * FROM usuario WHERE email = :email';
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    
            return $resultado ?: null;
        } catch (\PDOException $e) {
            return null;
        }
    }

        public function criar(array $dados) {
            $sql = 'INSERT INTO usuario (nome, sobrenome, email, senha_hash)
                    VALUES (:nome, :sobrenome, :email, :senha_hash)';
        

        try {
            $conn = \Garden\Core\Database::getInstance();
            $stmt = $conn->prepare($sql);

            $senhaCriptografada = password_hash($dados['senha'], PASSWORD_ARGON2ID);

            $stmt->bindParam(':nome', $dados['nome']);
            $stmt->bindParam(':sobrenome', $dados['sobrenome']);
            $stmt->bindParam(':email', $dados['email']);
            $stmt->bindParam(':senha_hash', $senhaCriptografada);

            $stmt->execute();
            return $conn->lastInsertId();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function atualizar(int $id, array $dados) {
         $camposParaAtualizar = [];

         foreach(array_keys($dados) as $campo) {
            if ($campo === 'senha') {
                $camposParaAtualizar[] = "senha_hash = :senha_hash";
            } else {
                $camposParaAtualizar[] = "{$campo} = :{$campo}";
            }
         }
         $listaDeCampos = implode(', ', $camposParaAtualizar);

         $sql = "UPDATE usuario SET {$listaDeCampos} WHERE id_usuario = :id";

         try {
            $conn = \Garden\Core\Database::getInstance();
            $stmt = $conn->prepare($sql);

            foreach ($dados as $campo => $valor) {
                if ($campo === 'senha') {
                    $senhaCriptografada = password_hash($valor, PASSWORD_ARGON2ID);
                    $stmt->bindValue(":senha_hash", $senhaCriptografada);
                } else {
                    $stmt->bindValue(":{$campo}", $valor);
                }
            }
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
    } catch (\PDOException $e) {
        return false; 
    }
}}