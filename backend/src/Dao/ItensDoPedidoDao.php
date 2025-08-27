<?php

namespace Garden\Dao;

use PDO;
use Garden\core\Database;
use Garden\models\ItensDoPedido;

class ItensDoPedidoDao
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }

    public function buscarPorPedidoId(int $idPedido): array
    {
        try {
            $sql = 'SELECT * FROM itens_do_pedido WHERE id_pedido = :id_pedido';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id_pedido', $idPedido, PDO::PARAM_INT);
            $stmt->execute();

            $listaDeDados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $itens = [];

            foreach ($listaDeDados as $dados) {
                $itens[] = $this->mapItensDoPedido($dados);
            }
            return $itens;
        } catch (\PDOException $e) {
            return [];
        }
    }

    public function criar(ItensDoPedido $item): int|false
    {
        try {
            $sql = 'INSERT INTO itens_do_pedido (id_pedido, id_produto, quantidade, preco_unitario) 
                    VALUES (:id_pedido, :id_produto, :quantidade, :preco_unitario)';
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id_pedido', $item->getIdPedido(), PDO::PARAM_INT);
            $stmt->bindValue(':id_produto', $item->getIdProduto(), PDO::PARAM_INT);
            $stmt->bindValue(':quantidade', $item->getQuantidade(), PDO::PARAM_INT);
            $stmt->bindValue(':preco_unitario', $item->getPrecoUnitario());
            
            $stmt->execute();
            return (int) $this->conn->lastInsertId();
        } catch (\PDOException $e) {
            return false;
        }
    }

    private function mapItensDoPedido(array $dados): ItensDoPedido
    {
        return new ItensDoPedido(
            id: $dados['id_itens_pedido'],
            idPedido: $dados['id_pedido'],
            idProduto: $dados['id_produto'],
            quantidade: $dados['quantidade'],
            precoUnitario: $dados['preco_unitario'],
            criadoEm: $dados['criado_em'],
            atualizacaoEm: $dados['atualizado_em']
        );
    }
}