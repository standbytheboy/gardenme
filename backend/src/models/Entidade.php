<?php

namespace Garden\Models;

abstract class Entidade
{
    protected ?int $id;
    protected ?string $criadoEm;
    protected ?string $atualizacaoEm;

    public function __construct(?int $id, ?string $criadoEm, ?string $atualizacaoEm)
    {
        $this->id = $id;
        $this->criadoEm = $criadoEm;
        $this->atualizacaoEm = $atualizacaoEm;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCriadoEm(): ?string
    {
        return $this->criadoEm;
    }

    public function getAtualizadoEm(): ?string
    {
        return $this->atualizacaoEm;
    }
}