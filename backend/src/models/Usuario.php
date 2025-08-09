<?php

namespace Garden\Models;
use Garden\Models\Entidade;

class Usuario extends Entidade
{
    private string $nome;
    private string $sobrenome;
    private string $email;
    private ?string $celular;
    private bool $isAdmin;

    public function __construct(
        ?int $id = null,
        ?string $criadoEm = null,
        ?string $atualizacaoEm = null,
        string $nome = '',
        string $sobrenome = '',
        string $email = '',
        ?string $celular = null,
        bool $isAdmin = false
    ) {
        parent::__construct($id, $criadoEm, $atualizacaoEm);
        $this->nome = $nome;
        $this->sobrenome = $sobrenome;
        $this->email = $email;
        $this->celular = $celular;
        $this->isAdmin = $isAdmin;
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
    public function isAdmin(): bool
    {
        return $this->isAdmin;
    }
}
