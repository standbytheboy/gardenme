<?php

namespace Garden\Dao;

use PDO;
use Garden\core\Database;
use Garden\models\Status;

class StatusDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function listarTodos(): array
    {
        try {
            $sql = 'SELECT * FROM status ORDER BY descricao ASC';
            $stmt = $this->conn->query($sql);
            $stmt->execute();

            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $listaStatus = [];

            foreach ($listaDeDados as $dados) {
                $listaStatus[] = $this->mapStatus($dados);
            }
            return $listaStatus;
        } catch (\PDOException $e) {
            return [];
        }
    }

    public function buscarPorId(int $id): ?Status
    {
        try {
            $sql = 'SELECT * FROM status WHERE id_status = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            return $dados ? $this->mapStatus($dados) : null;
        } catch (\PDOException $e) {
            return null;
        }
    }

    public function criar(Status $status): int|false
    {
        try {
            $sql = 'INSERT INTO status (descricao) VALUES (:descricao)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':descricao', $status->getDescricao());
            $stmt->execute();
            return (int) $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function atualizar(Status $status): bool
    {
        try {
            $sql = 'UPDATE status SET descricao = :descricao WHERE id_status = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':descricao', $status->getDescricao());
            $stmt->bindValue(':id', $status->getId(), PDO::PARAM_INT);
            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function deletar(int $id): bool
    {
        try {
            $sql = 'DELETE FROM status WHERE id_status = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            return false;
        }
    }

    private function mapStatus(array $dados): Status
    {
        return new Status(
            id: $dados['id_status'],
            descricao: $dados['descricao'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em']
        );
    }
}