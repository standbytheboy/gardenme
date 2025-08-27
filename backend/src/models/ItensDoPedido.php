<?php

namespace Garden\models;

use Garden\models\Entidade;

class ItensDoPedido extends Entidade
{
    private int $idPedido;
    private int $idProduto;
    private int $quantidade;
    private float $precoUnitario;

    public function __construct(
        ?int $id = null,
        int $idPedido = 0,
        int $idProduto = 0,
        int $quantidade = 0,
        float $precoUnitario = 0.0,
        ?string $criadoEm = null,
        ?string $atualizacaoEm = null
    ) {
        parent::__construct($id, $criadoEm, $atualizacaoEm);
        $this->idPedido = $idPedido;
        $this->idProduto = $idProduto;
        $this->quantidade = $quantidade;
        $this->precoUnitario = $precoUnitario;
    }

    public function getIdPedido(): int
    {
        return $this->idPedido;
    }

    public function getIdProduto(): int
    {
        return $this->idProduto;
    }

    public function getQuantidade(): int
    {
        return $this->quantidade;
    }

    public function getPrecoUnitario(): float
    {
        return $this->precoUnitario;
    }
}