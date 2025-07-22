<?php

namespace Garden\Dao;

use PDO;
use Garden\Core\Database;
use Garden\Models\Endereco;

class EnderecoDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function listarPorUsuarioId(int $id_usuario): array
    {
        try {
            $sql = 'SELECT * FROM endereco WHERE id_usuario = :id_usuario ORDER BY apelido ASC';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $stmt->execute();

            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $enderecos = [];

            foreach ($listaDeDados as $dados) {
                $enderecos[] = $this->mapEndereco($dados);
            }

            return $enderecos;
    } catch (\Exception $e) {
             return [];
        }
    }

    public function buscarPorId(int $id): ?Endereco {
        try {
            $sql = 'SELECT * FROM endereco WHERE id_endereco = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            return $dados ? $this->mapEndereco($dados) : null;
        } catch (\PDOException $e) {
            return null;
        }
    }

    public function criar (Endereco $endereco): int|false {
        try {
            $sql = 'INSERT INTO endereco (id_usuario, apelido, cep, logradouro, numero, bairro, cidade, estado, complemento) 
                    VALUES (:id_usuario, :apelido, :cep, :logradouro, :numero, :bairro, :cidade, :estado, :complemento)';

            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(':id_usuario', $endereco->getIdUsuario());
            $stmt->bindValue(':apelido', $endereco->getApelido());
            $stmt->bindValue(':cep', $endereco->getCep());
            $stmt->bindValue(':logradouro', $endereco->getLogradouro());
            $stmt->bindValue(':numero', $endereco->getNumero());
            $stmt->bindValue(':bairro', $endereco->getBairro());
            $stmt->bindValue(':cidade', $endereco->getCidade());
            $stmt->bindValue(':estado', $endereco->getEstado());
            $stmt->bindValue(':complemento', $endereco->getComplemento());

            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function atualizar(Endereco $endereco): bool {
        try {
            $sql = 'UPDATE endereco SET 
                        apelido = :apelido, cep = :cep, logradouro = :logradouro, numero = :numero, 
                        bairro = :bairro, cidade = :cidade, estado = :estado, complemento = :complemento
                    WHERE id_endereco = :id AND id_usuario = :id_usuario';

            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(':apelido', $endereco->getApelido());
            $stmt->bindValue(':cep', $endereco->getCep());
            $stmt->bindValue(':logradouro', $endereco->getLogradouro());
            $stmt->bindValue(':numero', $endereco->getNumero());
            $stmt->bindValue(':bairro', $endereco->getBairro());
            $stmt->bindValue(':cidade', $endereco->getCidade());
            $stmt->bindValue(':estado', $endereco->getEstado());
            $stmt->bindValue(':complemento', $endereco->getComplemento());
            $stmt->bindValue(':id', $endereco->getId(), PDO::PARAM_INT);
            $stmt->bindValue(':id_usuario', $endereco->getIdUsuario(), PDO::PARAM_INT);

            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }

    public function deletar(int $id_endereco, int $id_usuario): bool
    {
        try {
            $sql = 'DELETE FROM endereco WHERE id_endereco = :id_endereco AND id_usuario = :id_usuario';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id_endereco', $id_endereco, PDO::PARAM_INT);
            $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            return false;
        }
    }

    private function mapEndereco(array $dados): Endereco
    {
        return new Endereco(
            id: $dados['id_endereco'],
            idUsuario: $dados['id_usuario'], 
            apelido: $dados['apelido'],
            cep: $dados['cep'],
            logradouro: $dados['logradouro'],
            numero: $dados['numero'],
            bairro: $dados['bairro'],
            cidade: $dados['cidade'],
            estado: $dados['estado'],
            complemento: $dados['complemento'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em']
        );
    }
}