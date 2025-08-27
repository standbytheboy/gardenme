<?php

namespace Garden\models;

use Garden\models\Entidade;

class Status extends Entidade
{
    private string $descricao;

    public function __construct(
        ?int $id = null,
        string $descricao = '',
        ?string $criadoEm = null,
        ?string $atualizacaoEm = null
    ) {
        parent::__construct($id, $criadoEm, $atualizacaoEm);
        $this->descricao = $descricao;
    }

    public function getDescricao(): string
    {
        return $this->descricao;
    }
}