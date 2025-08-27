<?php

namespace Garden\models;

use Garden\models\Entidade;

class OrdemDePedido extends Entidade
{
    private int $idUsuario;
    private int $idEndereco;
    private int $idStatus;
    private float $precoTotal;
    private float $valorFrete;
    private ?string $codigoRastreio;
    private string $pagamentoMetodo;
    private string $pagamentoStatus;
    private ?string $pagamentoTransacaoId;

    public function __construct(
        ?int $id = null,
        int $idUsuario = 0,
        int $idEndereco = 0,
        int $idStatus = 0,
        float $precoTotal = 0.0,
        float $valorFrete = 0.0,
        ?string $codigoRastreio = null,
        string $pagamentoMetodo = '',
        string $pagamentoStatus = '',
        ?string $pagamentoTransacaoId = null,
        ?string $criadoEm = null,
        ?string $atualizacaoEm = null
    ) {
        parent::__construct($id, $criadoEm, $atualizacaoEm);
        $this->idUsuario = $idUsuario;
        $this->idEndereco = $idEndereco;
        $this->idStatus = $idStatus;
        $this->precoTotal = $precoTotal;
        $this->valorFrete = $valorFrete;
        $this->codigoRastreio = $codigoRastreio;
        $this->pagamentoMetodo = $pagamentoMetodo;
        $this->pagamentoStatus = $pagamentoStatus;
        $this->pagamentoTransacaoId = $pagamentoTransacaoId;
    }

    public function getIdUsuario(): int
    {
        return $this->idUsuario;
    }

    public function getIdEndereco(): int
    {
        return $this->idEndereco;
    }

    public function getIdStatus(): int
    {
        return $this->idStatus;
    }

    public function getPrecoTotal(): float
    {
        return $this->precoTotal;
    }

    public function getValorFrete(): float
    {
        return $this->valorFrete;
    }

    public function getCodigoRastreio(): ?string
    {
        return $this->codigoRastreio;
    }

    public function getPagamentoMetodo(): string
    {
        return $this->pagamentoMetodo;
    }

    public function getPagamentoStatus(): string
    {
        return $this->pagamentoStatus;
    }

    public function getPagamentoTransacaoId(): ?string
    {
        return $this->pagamentoTransacaoId;
    }
}