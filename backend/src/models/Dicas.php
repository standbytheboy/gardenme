<?php

namespace Garden\models;

use Garden\models\Entidade;

class Dicas extends Entidade
{
    private string $tituloDica;
    private string $conteudoDica;
    private ?int $idProduto;

    public function __construct(
        ?int $idDica = null,
        string $tituloDica = '',
        string $conteudoDica = '',
        ?int $idProduto = null,
        ?string $criadoEm = null,
        ?string $atualizacaoEm = null
    ) {
        parent::__construct($idDica, $criadoEm, $atualizacaoEm);
        $this->tituloDica = $tituloDica;
        $this->conteudoDica = $conteudoDica;
        $this->idProduto = $idProduto;
    }

    public function getTituloDica(): string
    {
        return $this->tituloDica;
    }

    public function getConteudoDica(): string
    {
        return $this->conteudoDica;
    }

    public function getIdProduto(): ?int
    {
        return $this->idProduto;
    }
}
