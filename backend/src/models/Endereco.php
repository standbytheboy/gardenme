<?php

namespace Garden\models;

use Garden\models\Entidade;

class Endereco extends Entidade
{
    private int $idUsuario;
    private ?string $apelido;
    private string $cep;
    private string $logradouro;
    private string $numero;
    private string $bairro;
    private string $cidade;
    private string $estado;
    private ?string $complemento;

    public function __construct(
        ?int $id = null,
        int $idUsuario = 0,
        ?string $apelido = null,
        string $cep = '',
        string $logradouro = '',
        string $numero = '',
        string $bairro = '',
        string $cidade = '',
        string $estado = '',
        ?string $complemento = null,
        ?string $criadoEm = null,
        ?string $atualizacaoEm = null
    ) {
        parent::__construct($id, $criadoEm, $atualizacaoEm);
        $this->idUsuario = $idUsuario;
        $this->apelido = $apelido;
        $this->cep = $cep;
        $this->logradouro = $logradouro;
        $this->numero = $numero;
        $this->bairro = $bairro;
        $this->cidade = $cidade;
        $this->estado = $estado;
        $this->complemento = $complemento;
    }

    public function getIdUsuario(): int
    {
        return $this->idUsuario;
    }
    public function getApelido(): ?string
    {
        return $this->apelido;
    }
    public function getCep(): string
    {
        return $this->cep;
    }
    public function getLogradouro(): string
    {
        return $this->logradouro;
    }
    public function getNumero(): string
    {
        return $this->numero;
    }
    public function getBairro(): string
    {
        return $this->bairro;
    }
    public function getCidade(): string
    {
        return $this->cidade;
    }
    public function getEstado(): string
    {
        return $this->estado;
    }
    public function getComplemento(): ?string
    {
        return $this->complemento;
    }
}
