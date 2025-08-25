<?php

namespace Garden\Controllers;

use Garden\DAO\ProdutoDAO;
use Garden\Models\Produto;

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
        // Aqui você poderia mapear para um array mais simples se desejado,
        // mas para produtos, enviar o objeto completo pode ser útil.
        header('Content-Type: application/json');
        echo json_encode($produtos);
    }

    public function detalhar(int $id)
    {
        $produto = $this->produtoDAO->buscarPorId($id);

        header('Content-Type: application/json');
        if ($produto) {
            echo json_encode($produto);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Produto não encontrado.']);
        }
    }

    public function criar()
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        // Validação
        $erros = [];
        if (!isset($dadosCorpo->nome_produto) || empty($dadosCorpo->nome_produto)) $erros[] = 'nome_produto é obrigatório.';
        if (!isset($dadosCorpo->preco) || !is_numeric($dadosCorpo->preco)) $erros[] = 'preco é obrigatório e deve ser numérico.';
        if (!isset($dadosCorpo->id_categoria) || !is_int($dadosCorpo->id_categoria)) $erros[] = 'id_categoria é obrigatório e deve ser um inteiro.';

        if (!empty($erros)) {
            http_response_code(400);
            echo json_encode(['erros' => $erros]);
            return;
        }
        
        // Assumindo que o Model Produto tem um construtor similar aos outros
        $produto = new Produto(
            nomeProduto: $dadosCorpo->nome_produto,
            preco: (float) $dadosCorpo->preco,
            idCategoria: (int) $dadosCorpo->id_categoria,
            descricaoTexto: $dadosCorpo->descricao_texto ?? ''
        );

        $resultado = $this->produtoDAO->criar($produto);

        if ($resultado === 'conflict') {
            http_response_code(409);
            echo json_encode(['mensagem' => 'Erro ao criar o produto. O nome já está em uso.']);
        } elseif ($resultado) {
            http_response_code(201);
            echo json_encode(['id_produto' => $resultado, 'mensagem' => 'Produto criado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao criar o produto.']);
        }
    }

    // A implementação dos métodos atualizar() e deletar() seguiria o mesmo padrão do CategoriaController
}