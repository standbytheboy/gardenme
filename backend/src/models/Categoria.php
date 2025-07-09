<?php

namespace Garden\Models;
use Garden\Models\Entidade; 

class Categoria extends Entidade {
    private string $nomeCategoria;

    public function __construct(?int $idCategoria, string $nomeCategoria, ?string $criadoEm, $atualizacaoEm) {
        parent::__construct($idCategoria, $criadoEm, $atualizacaoEm);
        $this->nomeCategoria = $nomeCategoria;
    }

    public function getNomeCategoria(): string {
        return $this->nomeCategoria;
    }

}