<?php

namespace Garden\Controllers;

use Garden\DAO\EnderecoDAO;
use Garden\Models\Endereco;

class EnderecoController
{
    private EnderecoDAO $enderecoDAO;

    public function __construct()
    {
        $this->enderecoDAO = new EnderecoDAO();
    }

    public function listarPorUsuario(int $id_usuario, object $dadosToken)
    {
        $idUsuarioLogado = $dadosToken->data->id_usuario;

        if ($idUsuarioLogado !== $id_usuario) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado.']);
            return;
        }

        $enderecos = $this->enderecoDAO->listarPorUsuarioId($id_usuario);

        $resultado = array_map(function ($endereco) {
            return [
                'id' => $endereco->getId(),
                'apelido' => $endereco->getApelido(),
                'cep' => $endereco->getCep(),
                'logradouro' => $endereco->getLogradouro(),
                'numero' => $endereco->getNumero(),
                'bairro' => $endereco->getBairro(),
                'cidade' => $endereco->getCidade(),
                'estado' => $endereco->getEstado(),
                'complemento' => $endereco->getComplemento()
            ];
        }, $enderecos);

        header('Content-Type: application/json');
        echo json_encode($resultado);
    }

    public function criar(int $id_usuario, object $dadosToken)
    {
        $idUsuarioLogado = $dadosToken->data->id_usuario;

        if ($idUsuarioLogado !== $id_usuario) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado.']);
            return;
        }

        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (empty($dadosCorpo->cep) || empty($dadosCorpo->logradouro) || empty($dadosCorpo->numero) || empty($dadosCorpo->bairro) || empty($dadosCorpo->cidade) || empty($dadosCorpo->estado)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'CEP, logradouro e número são campos obrigatórios.']);
            return;
        }

        $endereco = new Endereco(
            idUsuario: $id_usuario,
            apelido: $dadosCorpo->apelido ?? null,
            cep: $dadosCorpo->cep,
            logradouro: $dadosCorpo->logradouro,
            numero: $dadosCorpo->numero,
            bairro: $dadosCorpo->bairro ?? '',
            cidade: $dadosCorpo->cidade ?? '',
            estado: $dadosCorpo->estado ?? '',
            complemento: $dadosCorpo->complemento ?? null
        );

        $novoId = $this->enderecoDAO->criar($endereco);

        if ($novoId) {
            http_response_code(201);
            echo json_encode(['id_endereco' => $novoId, 'mensagem' => 'Endereço criado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao criar o endereço.']);
        }
    }

    public function atualizar(int $id_endereco, object $dadosToken) {
        $idUsuarioLogado = $dadosToken->data->id_usuario;
        
        $enderecoExistente = $this->enderecoDAO->buscarPorId($id_endereco);

        if (!$enderecoExistente) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Endereço não encontrado para atualização.']);
            return;
        }

        if ($enderecoExistente->getIdUsuario() !== $idUsuarioLogado) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Você não pode atualizar um endereço que não é seu.']);
            return;
        }
        
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        $enderecoParaAtualizar = new Endereco(
            id: $id_endereco,
            idUsuario: $idUsuarioLogado,
            apelido: $dadosCorpo->apelido ?? $enderecoExistente->getApelido(),
            cep: $dadosCorpo->cep ?? $enderecoExistente->getCep(),
            logradouro: $dadosCorpo->logradouro ?? $enderecoExistente->getLogradouro(),
            numero: $dadosCorpo->numero ?? $enderecoExistente->getNumero(),
            bairro: $dadosCorpo->bairro ?? $enderecoExistente->getBairro(),
            cidade: $dadosCorpo->cidade ?? $enderecoExistente->getCidade(),
            estado: $dadosCorpo->estado ?? $enderecoExistente->getEstado(),
            complemento: $dadosCorpo->complemento ?? $enderecoExistente->getComplemento()
        );

        $sucesso = $this->enderecoDAO->atualizar($enderecoParaAtualizar);

        if ($sucesso) {
            echo json_encode(['mensagem' => 'Endereço atualizado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao tentar atualizar o endereço.']);
        }
    }

    public function deletar(int $id_endereco, object $dadosToken)
    {
        $idUsuarioLogado = $dadosToken->data->id_usuario;

        $enderecoExistente = $this->enderecoDAO->buscarPorId($id_endereco);

        if (!$enderecoExistente) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Endereço não encontrado para exclusão.']);
            return;
        }

        if ($enderecoExistente->getIdUsuario() !== $idUsuarioLogado) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Você não pode deletar um endereço que não é seu.']);
            return;
        }

        $sucesso = $this->enderecoDAO->deletar($id_endereco, $idUsuarioLogado);

        if ($sucesso) {
            echo json_encode(['mensagem' => 'Endereço deletado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao deletar o endereço.']);
        }
    }
}
