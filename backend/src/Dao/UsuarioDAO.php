<?php

namespace Garden\Dao;

use PDO;
use Garden\Core\Database;
use Garden\Models\Usuario;

class UsuarioDAO {
    private PDO $conn;

    public function __construct() {
        $this->conn = \Garden\Core\Database::getInstance();
    }

    public function buscarPorEmail(string $email): ?array {
        try {
            $sql = 'SELECT * FROM usuario WHERE email = :email';
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            return $resultado ?: null;
        } catch (\PDOException $e) {
            return null;
        }
    }

        public function criar(array $dados) {
        try {
            $sql = 'INSERT INTO usuario (nome, sobrenome, email, senha_hash)
                    VALUES (:nome, :sobrenome, :email, :senha_hash)';
            
            $stmt = $this->conn->prepare($sql);

            $senhaCriptografada = password_hash($dados['senha'], PASSWORD_ARGON2ID);

            $stmt->bindParam(':nome', $dados['nome']);
            $stmt->bindParam(':sobrenome', $dados['sobrenome']);
            $stmt->bindParam(':email', $dados['email']);
            $stmt->bindParam(':senha_hash', $senhaCriptografada);

            $stmt->execute();
            return $this->conn->lastInsertId();
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
            $stmt = $this->conn->prepare($sql);

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