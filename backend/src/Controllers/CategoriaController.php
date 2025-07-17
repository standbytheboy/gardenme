<?php

namespace Garden\Controllers;

use Garden\DAO\CategoriaDAO;
use Garden\Models\Categoria;

class CategoriaController
{
    private CategoriaDAO $categoriaDAO;

    public function __construct()
    {
        $this->categoriaDAO = new CategoriaDAO();
    }

    public function listar()
    {
        $categorias = $this->categoriaDAO->listarTodos();

        $resultado = array_map(function ($categoria) {
            return [
                'id_categoria' => $categoria->getId(),
                'nome_categoria' => $categoria->getNomeCategoria()
            ];
        }, $categorias);

        header('Content-Type: application/json');
        echo json_encode($resultado);
    }

    public function detalhar(int $id)
    {
        $categoria = $this->categoriaDAO->buscarPorId($id);

        header('Content-Type: application/json');
        if ($categoria) {
            $resultado = [
                'id_categoria' => $categoria->getId(),
                'nome_categoria' => $categoria->getNomeCategoria(),
                'criado_em' => $categoria->getCriadoEm(),
                'atualizado_em' => $categoria->getAtualizadoEm()
            ];
            echo json_encode($resultado);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Categoria não encontrada.']);
        }
    }

    public function criar()
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (!isset($dadosCorpo->nome_categoria) || empty($dadosCorpo->nome_categoria)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'O campo nome_categoria é obrigatório.']);
            return;
        }

        $categoria = new Categoria(
            idCategoria: null,
            nomeCategoria: $dadosCorpo->nome_categoria,
            criadoEm: null,
            atualizacaoEm: null
        );

        $novoId = $this->categoriaDAO->criar($categoria);

        if ($novoId) {
            http_response_code(201);
            echo json_encode(['id_categoria' => $novoId, 'mensagem' => 'Categoria criada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao criar a categoria. O nome pode já estar em uso.']);
        }
    }

    public function atualizar(int $id)
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (!isset($dadosCorpo->nome_categoria) || empty($dadosCorpo->nome_categoria)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'O campo nome_categoria é obrigatório.']);
            return;
        }

        $categoria = new Categoria(
            idCategoria: $id,
            nomeCategoria: $dadosCorpo->nome_categoria,
            criadoEm: null,
            atualizacaoEm: null
        );

        $sucesso = $this->categoriaDAO->atualizar($categoria);

        if ($sucesso) {
            echo json_encode(['mensagem' => 'Categoria atualizada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao atualizar categoria.']);
        }
    }

    public function deletar(int $id)
    {
        $sucesso = $this->categoriaDAO->deletar($id);

        if ($sucesso) {
            http_response_code(200);
            echo json_encode(['mensagem' => 'Categoria deletada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao deletar categoria.']);
        }
    }
}