<?php

namespace Garden\Controllers;

use Garden\Dao\ProdutoDao;
use Garden\models\Dicas;
use Garden\Dao\DicasDao;

class ProdutoController
{
    private ProdutoDao $produtoDao;
    private DicasDao $dicasDao;

    public function __construct()
    {
        $this->produtoDao = new ProdutoDao();
        $this->dicasDao = new DicasDao();
    }

    public function listar(){
    // Limpa qualquer saída de buffer anterior para evitar erros de JSON
    if (ob_get_level()) {
        ob_end_clean();
    }

    header('Content-Type: application/json; charset=utf-8');

    $termo = $_GET['search'] ?? null;

    try {
        $produtos = $this->produtoDao->listarTodos($termo);
        echo json_encode($produtos, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    } catch (\Exception $e) {
        // Se houver qualquer erro (na consulta ou no encode), captura e retorna um erro 500
        http_response_code(500);
        error_log("Erro em ProdutoController->listar: " . $e->getMessage()); // Regista o erro para depuração
        echo json_encode(['mensagem' => 'Ocorreu um erro interno ao buscar os produtos.']);
    }
    exit; // Garante que nada mais é enviado após a resposta
}

    public function detalhar(int $id){
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
                $idNovoProduto = (int)$resultado;
                $nomeProduto = $dadosCorpo['nome_produto'];
                $descricaoProduto = $dadosCorpo['descricao'] ?? '';

                // Chama a função para gerar e salvar as dicas
                $this->gerarEsalvarDicasComIA($idNovoProduto, $nomeProduto, $descricaoProduto);

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

    private function gerarEsalvarDicasComIA(int $idProduto, string $nomeProduto, string $descricaoProduto){
    $prompt = "Crie 3 dicas curtas e práticas para cuidar da planta '$nomeProduto'. 
    Considere a seguinte descrição: '$descricaoProduto'. 
    As dicas devem ser sobre rega, iluminação e um cuidado especial. 
    Formate a resposta como JSON no formato:
    { \"dicas\": [ {\"titulo\": \"...\", \"conteudo\": \"...\"}, ... ] }";

    // Configurar cURL
    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: ' . 'Bearer ' . getenv('OPENAI_API_KEY'),
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'model' => 'gpt-4o-mini', // pode trocar por gpt-4 ou gpt-3.5-turbo se quiser
        'messages' => [
            ['role' => 'system', 'content' => 'Você é um gerador de dicas de plantas. Responda sempre em JSON válido.'],
            ['role' => 'user', 'content' => $prompt],
        ],
        'temperature' => 0.7,
    ]));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30); // tempo máximo de 30 segundos
    $response = curl_exec($ch);
    if ($response === false) {
        error_log("Erro ao chamar OpenAI: " . curl_error($ch));
        curl_close($ch);
        return;
    }
    curl_close($ch);

    $data = json_decode($response, true);

    // Captura o conteúdo retornado
    $conteudoGerado = $data['choices'][0]['message']['content'] ?? '';
    if ($conteudoGerado) {
    $dadosResposta = json_decode($conteudoGerado, true);

    if ($dadosResposta && isset($dadosResposta['dicas'])) {
        foreach ($dadosResposta['dicas'] as $texto) {
            $dica = new Dicas(null, $idProduto, $texto);
            $this->dicasDao->criar($dica);
        }
        error_log("✅ Dicas geradas e salvas para o produto ID:");
    } else {
        error_log("⚠️ Resposta da IA não está em JSON válido -> " . $conteudoGerado);
    }
} else {
    error_log("⚠️ Não foi possível extrair conteúdo da resposta para produto ID:");
}

    // Tenta decodificar como JSON
    $dadosResposta = json_decode($conteudoGerado, true);

    if (isset($dadosResposta['dicas']) && is_array($dadosResposta['dicas'])) {
        foreach ($dadosResposta['dicas'] as $dicaInfo) {
            if (!empty($dicaInfo['titulo']) && !empty($dicaInfo['conteudo'])) {
                $novaDica = new Dicas(
                    tituloDica: $dicaInfo['titulo'],
                    conteudoDica: $dicaInfo['conteudo'],
                    idProduto: $idProduto
                );
                $this->dicasDao->criar($novaDica);
            }
        }
    } else {
        // Se a IA não retornar JSON válido, loga para depuração
        error_log("Resposta inesperada da OpenAI para '$nomeProduto': " . $conteudoGerado);
    }
    
}


    public function atualizar(int $id){
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
    public function deletar(int $id){
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
