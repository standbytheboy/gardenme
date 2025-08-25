<?php

namespace Garden\Models;

use Garden\Models\Entidade;

class Produto extends Entidade
{
    private ?int $idProduto;
    private int $idCategoria;
    private string $nomeProduto;
    private ?string $descricaoTexto;
    private float $preco;

    public function __construct(
        ?int $idProduto = null,
        int $idCategoria,
        string $nomeProduto,
        float $preco,
        ?string $descricaoTexto = '',
        ?string $criadoEm = null,
        ?string $atualizadoEm = null
    ) {
        parent::__construct($criadoEm, $atualizadoEm);

        $this->idProduto = $idProduto;
        $this->idCategoria = $idCategoria;
        $this->nomeProduto = $nomeProduto;
        $this->descricaoTexto = $descricaoTexto;
        $this->preco = $preco;
    }

    // GETTERS
    public function getIdProduto(): ?int
    {
        return $this->idProduto;
    }

    public function getIdCategoria(): int
    {
        return $this->idCategoria;
    }

    public function getNomeProduto(): string
    {
        return $this->nomeProduto;
    }

    public function getDescricaoTexto(): ?string
    {
        return $this->descricaoTexto;
    }

    public function getPreco(): float
    {
        return $this->preco;
    }

    // SETTERS
    public function setIdProduto(int $id): void
    {
        $this->idProduto = $id;
    }

    public function setIdCategoria(int $idCategoria): void
    {
        $this->idCategoria = $idCategoria;
    }

    public function setNomeProduto(string $nome): void
    {
        $this->nomeProduto = $nome;
    }

    public function setDescricaoTexto(string $descricao): void
    {
        $this->descricaoTexto = $descricao;
    }

    public function setPreco(float $preco): void
    {
        $this->preco = $preco;
    }
}
