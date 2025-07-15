<?php

namespace Garden\Models;
die('PAREI AQUI: O ARQUIVO Entidade.php FOI CARREGADO!');
use Garden\Models\Entidade;

class Usuario extends Entidade
{
    private string $nome;
    private string $sobrenome;
    private string $email;
    private ?string $celular;

    public function __construct(
        ?int $id = null,
        ?string $criadoEm = null,
        ?string $atualizacaoEm = null,
        string $nome = '',
        string $sobrenome = '',
        string $email = '',
        ?string $celular = null
    ) {
        parent::__construct($id, $criadoEm, $atualizacaoEm);
        $this->nome = $nome;
        $this->sobrenome = $sobrenome;
        $this->email = $email;
        $this->celular = $celular;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function getSobrenome(): string
    {
        return $this->sobrenome;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getCelular(): ?string
    {
        return $this->celular;
    }
}
