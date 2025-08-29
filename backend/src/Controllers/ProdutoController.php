<?php

namespace Garden\Controllers;

use Garden\Dao\ProdutoDao;

class ProdutoController
{
    private ProdutoDao $produtoDao;

    public function __construct()
    {
        $this->produtoDao = new ProdutoDao();
    }

    public function listar()
{
    // Limpa qualquer saída de buffer anterior para evitar erros de JSON
    if (ob_get_level()) {
        ob_end_clean();
    }

    header('Content-Type: application/json; charset=utf-8');

    try {
        $produtos = $this->produtoDao->listarTodos();
        echo json_encode($produtos, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    } catch (\Exception $e) {
        // Se houver qualquer erro (na consulta ou no encode), captura e retorna um erro 500
        http_response_code(500);
        error_log("Erro em ProdutoController->listar: " . $e->getMessage()); // Regista o erro para depuração
        echo json_encode(['mensagem' => 'Ocorreu um erro interno ao buscar os produtos.']);
    }
    exit; // Garante que nada mais é enviado após a resposta
}

    public function detalhar(int $id)
    {
        $produto = $this->produtoDao->buscarPorId($id);

        if ($produto) {
            echo json_encode($produto, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Produto não encontrado.'], JSON_UNESCAPED_UNICODE);
        }
    }


    public function criar() {
        // Limpa qualquer saída de buffer anterior
        if (ob_get_level()) {
            ob_end_clean();
        }
        header('Content-Type: application/json; charset=utf-8');

        $dadosCorpo = json_decode(file_get_contents('php://input'), true);

        // Validação de entrada
        $erros = [];
        if (empty($dadosCorpo['nome_produto'])) $erros[] = 'O nome do produto é obrigatório.';
        if (!isset($dadosCorpo['preco']) || !is_numeric($dadosCorpo['preco'])) $erros[] = 'O preço é obrigatório e deve ser numérico.';
        if (empty($dadosCorpo['id_categoria']) || !is_numeric($dadosCorpo['id_categoria'])) $erros[] = 'Inserir a categoria é obrigatório e deve ser um inteiro.';

        if (!empty($erros)) {
            http_response_code(400); // Bad Request
            echo json_encode(['erros' => $erros], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $resultado = $this->produtoDao->criar($dadosCorpo);

            if ($resultado === 'conflict') {
                http_response_code(409); // Conflict
                echo json_encode(['mensagem' => 'Erro ao criar: nome de produto já existente.'], JSON_UNESCAPED_UNICODE);
            } elseif ($resultado) {
                http_response_code(201); // Created
                echo json_encode(['id_produto' => $resultado, 'mensagem' => 'Produto criado com sucesso.'], JSON_UNESCAPED_UNICODE);
            } else {
                // Este 'else' pode ser removido se a Dao sempre lançar exceção em caso de falha
                http_response_code(500); // Internal Server Error
                echo json_encode(['mensagem' => 'Erro desconhecido ao criar produto.'], JSON_UNESCAPED_UNICODE);
            }

        } catch (\PDOException $e) {
            // Captura especificamente erros de banco de dados (PDO)
            http_response_code(500);
            // Loga o erro real para você poder depurar
            error_log("Erro de PDO em ProdutoController->criar: " . $e->getMessage()); 
            // Envia uma mensagem genérica para o usuário
            echo json_encode(['mensagem' => 'Ocorreu um erro interno no servidor ao processar sua solicitação.'], JSON_UNESCAPED_UNICODE);

        } catch (\Exception $e) {
            // Captura quaisquer outros erros
            http_response_code(500);
            error_log("Erro geral em ProdutoController->criar: " . $e->getMessage());
            echo json_encode(['mensagem' => 'Ocorreu um erro inesperado.'], JSON_UNESCAPED_UNICODE);
        } finally {
            // Garante que o script pare após enviar a resposta
            exit;
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

        $resultado = $this->produtoDao->atualizar($id, $dadosCorpo);

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
        $produto = $this->produtoDao->buscarPorId($id);

        if (!$produto) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Produto não encontrado.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $sucesso = $this->produtoDao->deletar($id);

        if ($sucesso) {
            echo json_encode(['mensagem' => 'Produto deletado com sucesso.'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao deletar produto.'], JSON_UNESCAPED_UNICODE);
        }
    }
    public function buscarPrimeiro() {
        header('Content-Type: application/json');
        try {
            $produtoDao = new ProdutoDao();
            $produto = $produtoDao->buscarPrimeiro();

            if ($produto) {
                echo json_encode($produto);
            } else {
                http_response_code(404); // Not Found
                echo json_encode(['mensagem' => 'Nenhum produto encontrado.']);
            }
        } catch (\Exception $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['mensagem' => 'Erro ao buscar o produto: ' . $e->getMessage()]);
        }
    }
}
