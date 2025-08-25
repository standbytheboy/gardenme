<?php

namespace Garden\Controllers;

use Garden\DAO\ProdutoDAO;

class ProdutoController
{
    private ProdutoDAO $produtoDAO;

    public function __construct()
    {
        $this->produtoDAO = new ProdutoDAO();
    }

    public function listar()
    {
        $produtos = $this->produtoDAO->listarTodos();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($produtos, JSON_UNESCAPED_UNICODE);
    }

    public function detalhar(int $id)
    {
        $produto = $this->produtoDAO->buscarPorId($id);

        header('Content-Type: application/json; charset=utf-8');
        if ($produto) {
            echo json_encode($produto, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Produto não encontrado.'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function criar()
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'), true);

        $erros = [];
        if (empty($dadosCorpo['nome_produto'])) $erros[] = 'nome_produto é obrigatório.';
        if (!isset($dadosCorpo['preco']) || !is_numeric($dadosCorpo['preco'])) $erros[] = 'preco é obrigatório e deve ser numérico.';
        if (!isset($dadosCorpo['id_categoria']) || !is_numeric($dadosCorpo['id_categoria'])) $erros[] = 'id_categoria é obrigatório e deve ser um inteiro.';

        if (!empty($erros)) {
            http_response_code(400);
            echo json_encode(['erros' => $erros], JSON_UNESCAPED_UNICODE);
            return;
        }

        $resultado = $this->produtoDAO->criar($dadosCorpo);

        header('Content-Type: application/json; charset=utf-8');
        if ($resultado === 'conflict') {
            http_response_code(409);
            echo json_encode(['mensagem' => 'Erro ao criar: nome já em uso.'], JSON_UNESCAPED_UNICODE);
        } elseif ($resultado) {
            http_response_code(201);
            echo json_encode(['id_produto' => $resultado, 'mensagem' => 'Produto criado com sucesso.'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao criar produto.'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function atualizar(int $id)
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'), true);

        $erros = [];
        if (empty($dadosCorpo['nome_produto'])) $erros[] = 'nome_produto é obrigatório.';
        if (!isset($dadosCorpo['preco']) || !is_numeric($dadosCorpo['preco'])) $erros[] = 'preco é obrigatório e deve ser numérico.';
        if (!isset($dadosCorpo['id_categoria']) || !is_numeric($dadosCorpo['id_categoria'])) $erros[] = 'id_categoria é obrigatório e deve ser um inteiro.';

        if (!empty($erros)) {
            http_response_code(400);
            echo json_encode(['erros' => $erros], JSON_UNESCAPED_UNICODE);
            return;
        }

        $resultado = $this->produtoDAO->atualizar($id, $dadosCorpo);

        header('Content-Type: application/json; charset=utf-8');
        if ($resultado === 'conflict') {
            http_response_code(409);
            echo json_encode(['mensagem' => 'Erro ao atualizar: nome já em uso.'], JSON_UNESCAPED_UNICODE);
        } elseif ($resultado) {
            echo json_encode(['mensagem' => 'Produto atualizado com sucesso.'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao atualizar produto.'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function deletar(int $id)
    {
        $produto = $this->produtoDAO->buscarPorId($id);

        header('Content-Type: application/json; charset=utf-8');
        if (!$produto) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Produto não encontrado.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $sucesso = $this->produtoDAO->deletar($id);

        if ($sucesso) {
            echo json_encode(['mensagem' => 'Produto deletado com sucesso.'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao deletar produto.'], JSON_UNESCAPED_UNICODE);
        }
    }
}
