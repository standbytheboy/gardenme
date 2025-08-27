<?php

namespace Garden\Controllers;

use Garden\Dao\StatusDao;
use Garden\models\Status;

class StatusController
{
    private StatusDao $statusDao;

    public function __construct()
    {
        $this->statusDao = new StatusDao();
    }

    public function listar()
    {
        $listaStatus = $this->statusDao->listarTodos();

        $resultado = array_map(function ($status) {
            return [
                'id_status' => $status->getId(),
                'descricao' => $status->getDescricao()
            ];
        }, $listaStatus);

        header('Content-Type: application/json');
        echo json_encode($resultado);
    }

    public function detalhar(int $id)
    {
        $status = $this->statusDao->buscarPorId($id);

        header('Content-Type: application/json');
        if ($status) {
            $resultado = [
                'id_status' => $status->getId(),
                'descricao' => $status->getDescricao(),
                'criado_em' => $status->getCriadoEm(),
                'atualizado_em' => $status->getAtualizadoEm()
            ];
            echo json_encode($resultado);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Status não encontrado.']);
        }
    }

    public function criar()
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (!isset($dadosCorpo->descricao) || empty($dadosCorpo->descricao)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'O campo descricao é obrigatório.']);
            return;
        }

        $status = new Status(descricao: $dadosCorpo->descricao);
        $novoId = $this->statusDao->criar($status);

        if ($novoId) {
            http_response_code(201);
            echo json_encode(['id_status' => $novoId, 'mensagem' => 'Status criado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao criar o status.']);
        }
    }
}