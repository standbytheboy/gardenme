<?php

namespace Garden\Dao;

use PDO;
use Garden\core\Database;
use Garden\models\Dicas;

class DicasDao
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function criar(Dicas $dica): int|false {
        try {
            $sql = 'INSERT INTO dicas (titulo_dica, conteudo_dica, id_produto) VALUES (:titulo, :conteudo, :id_produto)';

            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(':titulo', $dica->getTituloDica());
            $stmt->bindValue(':conteudo', $dica->getConteudoDica());
            $stmt->bindValue(':id_produto', $dica->getIdProduto());
            $stmt->execute();

            return $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function listarTodos(): array {
        try {
            $sql = 'SELECT * FROM dicas ORDER BY titulo_dica ASC';

            $stmt = $this->conn->query($sql);
            $stmt->execute();

            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $dicas = [];

            foreach ($listaDeDados as $dados) {
                $dicas[] = $this->mapDica($dados);
            }
            return $dicas;
        } catch (\PDOException $e) {
            return [];
        }
    }

    public function buscarPorProdutoIds(array $idsProdutos): array {
        if (empty($idsProdutos)) {
            return [];
        }
        // Cria os placeholders para a cláusula IN (?, ?, ?)
        $placeholders = implode(',', array_fill(0, count($idsProdutos), '?'));

        try {
            $sql = "SELECT d.*, p.nome_produto 
                    FROM dicas d
                    JOIN produtos p ON d.id_produto = p.id_produto
                    WHERE d.id_produto IN ($placeholders)";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute($idsProdutos);

            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $dicas = [];

            foreach ($listaDeDados as $dados) {
                $dica = $this->mapDica($dados);
                $dicas[] = [
                    'id_dica' => $dica->getId(),
                    'titulo_dica' => $dica->getTituloDica(),
                    'conteudo_dica' => $dica->getConteudoDica(),
                    'id_produto' => $dica->getIdProduto(),
                    'nome_produto' => $dados['nome_produto']
                ];
            }
            return $dicas;
        } catch (\PDOException $e) {
            error_log($e->getMessage());
            return [];
        }
    }

    public function atualizar(Dicas $dica): bool|string {
        try {
            $sql = 'UPDATE dicas SET titulo_dica = :titulo, conteudo_dica = :conteudo, id_produto = :id_produto WHERE id_dica = :id';

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':titulo', $dica->getTituloDica());
            $stmt->bindValue(':conteudo', $dica->getConteudoDica());
            $stmt->bindValue(':id_produto', $dica->getIdProduto());
            $stmt->bindValue(':id', $dica->getId(), PDO::PARAM_INT);

            return $stmt->execute();
        } catch (\PDOException $e) {
            if ($e->getCode() === '23000') {
                return 'conflict';
            }
            return false;
        }
    }

    public function deletar(int $id): bool {
        try {
            $sql = 'DELETE FROM dicas WHERE id_dica = :id';

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function mapDica(array $dados): Dicas {
        return new Dicas(
            idDica: $dados['id_dica'],
            tituloDica: $dados['titulo_dica'],
            conteudoDica: $dados['conteudo_dica'],
            idProduto: $dados['id_produto'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em']
        );
    }
}
