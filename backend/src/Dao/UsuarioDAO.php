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
            $sql = 'SELECT id_usuario, nome, sobrenome, email, celular, criado_em, atualizado_em, is_admin FROM usuario WHERE id_usuario = :id';
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
            $sql = 'INSERT INTO usuario (nome, sobrenome, email, celular, senha_hash, is_admin)
                    VALUES (:nome, :sobrenome, :email, :celular, :senha_hash, :is_admin)';
            
            $stmt = $this->conn->prepare($sql);

            $senhaCriptografada = password_hash($senhaPura, PASSWORD_ARGON2ID);

            $stmt->bindValue(':nome', $usuario->getNome());
            $stmt->bindValue(':sobrenome', $usuario->getSobrenome());
            $stmt->bindValue(':email', $usuario->getEmail());
            $stmt->bindValue(':celular', $usuario->getCelular());
            $stmt->bindValue(':senha_hash', $senhaCriptografada);
            $stmt->bindValue(':is_admin', $usuario->isAdmin());
            
            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                return 'conflict';
            }
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
            celular: $dados['celular'] ?? null,
            isAdmin: $dados['is_admin']
        );
    }

        public function getByToken(string $token): ?Usuario
    {
        // Busca por token apenas se o usuário estiver ativo
        $stmt = $this->conn->prepare("SELECT * FROM usuario WHERE token = :token AND ativo = 1 LIMIT 1");
        $stmt->execute([':token' => $token]);
        $data = $stmt->fetch();
        return $data ? $this->mapUsuario($data) : null;
    }

    public function updateToken(int $id, string $token): bool
    {
        $sql = "UPDATE usuario SET token = :token WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([':token' => $token, ':id' => $id]);
    }
    public function atualizar(int $id, array $dados): bool|string
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
            if ($e->getCode() === '23000') {
                return 'conflict';
            }
            return false;
        }
    }

    public function deletar(int $id): bool
    {
        $sql = "DELETE FROM usuario WHERE id_usuario = :id";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->rowCount() > 0;

        } catch (\PDOException $e) {
            return false;
        }
    }

}