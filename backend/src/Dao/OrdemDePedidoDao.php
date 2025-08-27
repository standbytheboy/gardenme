<?php

namespace Garden\Dao;

use PDO;
use Garden\core\Database;
use Garden\models\OrdemDePedido;

class OrdemDePedidoDao
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }
    
    public function buscarPorId(int $id): ?OrdemDePedido
    {
        try {
            $sql = 'SELECT * FROM ordem_de_pedido WHERE id_pedido = :id';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            return $dados ? $this->mapOrdemDePedido($dados) : null;
        } catch (\PDOException $e) {
            return null;
        }
    }
    
    // Método útil para buscar todos os pedidos de um usuário específico
    public function buscarPorUsuarioId(int $idUsuario): array
    {
        try {
            $sql = 'SELECT * FROM ordem_de_pedido WHERE id_usuario = :id_usuario ORDER BY criado_em DESC';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id_usuario', $idUsuario, PDO::PARAM_INT);
            $stmt->execute();
            
            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $pedidos = [];
            
            foreach ($listaDeDados as $dados) {
                $pedidos[] = $this->mapOrdemDePedido($dados);
            }
            return $pedidos;
        } catch (\PDOException $e) {
            return [];
        }
    }

    public function criar(OrdemDePedido $pedido): int|false
    {
        try {
            $sql = 'INSERT INTO ordem_de_pedido (id_usuario, id_endereco, id_status, preco_total, valor_frete, codigo_rastreio, pagamento_metodo, pagamento_status, pagamento_transacao_id) 
                    VALUES (:id_usuario, :id_endereco, :id_status, :preco_total, :valor_frete, :codigo_rastreio, :pagamento_metodo, :pagamento_status, :pagamento_transacao_id)';
            
            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(':id_usuario', $pedido->getIdUsuario(), PDO::PARAM_INT);
            $stmt->bindValue(':id_endereco', $pedido->getIdEndereco(), PDO::PARAM_INT);
            $stmt->bindValue(':id_status', $pedido->getIdStatus(), PDO::PARAM_INT);
            $stmt->bindValue(':preco_total', $pedido->getPrecoTotal());
            $stmt->bindValue(':valor_frete', $pedido->getValorFrete());
            $stmt->bindValue(':codigo_rastreio', $pedido->getCodigoRastreio());
            $stmt->bindValue(':pagamento_metodo', $pedido->getPagamentoMetodo());
            $stmt->bindValue(':pagamento_status', $pedido->getPagamentoStatus());
            $stmt->bindValue(':pagamento_transacao_id', $pedido->getPagamentoTransacaoId());
            
            $stmt->execute();
            return (int) $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            // Log do erro pode ser útil aqui: error_log($e->getMessage());
            return false;
        }
    }
    
    // Em um sistema real, a atualização de um pedido geralmente se restringe a campos como status ou código de rastreio.
    public function atualizarStatus(int $idPedido, int $idStatus): bool
    {
        try {
            $sql = 'UPDATE ordem_de_pedido SET id_status = :id_status WHERE id_pedido = :id_pedido';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id_status', $idStatus, PDO::PARAM_INT);
            $stmt->bindValue(':id_pedido', $idPedido, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (\PDOException $e) {
            return false;
        }
    }

    private function mapOrdemDePedido(array $dados): OrdemDePedido
    {
        return new OrdemDePedido(
            id: $dados['id_pedido'],
            idUsuario: $dados['id_usuario'],
            idEndereco: $dados['id_endereco'],
            idStatus: $dados['id_status'],
            precoTotal: $dados['preco_total'],
            valorFrete: $dados['valor_frete'],
            codigoRastreio: $dados['codigo_rastreio'],
            pagamentoMetodo: $dados['pagamento_metodo'],
            pagamentoStatus: $dados['pagamento_status'],
            pagamentoTransacaoId: $dados['pagamento_transacao_id'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em']
        );
    }
    public function buscarEnderecoPorId(int $idEndereco): ?array {
    try {
        $sql = 'SELECT * FROM endereco WHERE id_endereco = :id_endereco';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id_endereco', $idEndereco, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    } catch (\PDOException $e) {
        return null;
    }
}

}