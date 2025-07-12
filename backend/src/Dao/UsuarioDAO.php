<?php


namespace Garden\DAO; 

use PDO;
use Garden\Core\Database;
use Garden\Models\Usuario; 

class UsuarioDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function buscarPorEmail(string $email): ?array
    {
        try {
            $sql = 'SELECT * FROM usuario WHERE email = :email';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (\PDOException $e) {
            return null;
        }
    }

    public function buscarPorId(int $id): ?Usuario
    {
        try {
            $sql = 'SELECT id_usuario, nome, sobrenome, email, celular, criado_em, atualizado_em FROM usuario WHERE id_usuario = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            return $dados ? $this->mapUsuario($dados) : null;
            
        } catch (\PDOException $e) {
            return null;
        }
    }

    public function criar(Usuario $usuario, string $senhaPura): int|false
    {
        try {
            $sql = 'INSERT INTO usuario (nome, sobrenome, email, celular, senha_hash)
                    VALUES (:nome, :sobrenome, :email, :celular, :senha_hash)';
            
            $stmt = $this->conn->prepare($sql);

            $senhaCriptografada = password_hash($senhaPura, PASSWORD_ARGON2ID);

            $stmt->bindValue(':nome', $usuario->getNome());
            $stmt->bindValue(':sobrenome', $usuario->getSobrenome());
            $stmt->bindValue(':email', $usuario->getEmail());
            $stmt->bindValue(':celular', $usuario->getCelular());
            $stmt->bindValue(':senha_hash', $senhaCriptografada);
            
            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            return false;
        }
    }

    private function mapUsuario(array $dados): Usuario
    {
        return new Usuario(
            id: $dados['id_usuario'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em'],
            nome: $dados['nome'],
            sobrenome: $dados['sobrenome'],
            email: $dados['email'],
            celular: $dados['celular'] ?? null 
        );
    }

    public function atualizar(int $id, array $dados): bool
    {
        $camposParaAtualizar = [];
        foreach (array_keys($dados) as $campo) {
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
    }

}