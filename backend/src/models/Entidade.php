<?php

namespace Garden\Models;

class Entidade
{
    protected ?int $id = null;
    protected ?string $criadoEm = null;
    protected ?string $atualizadoEm = null;

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
        return $this->atualizadoEm;
    }
}
