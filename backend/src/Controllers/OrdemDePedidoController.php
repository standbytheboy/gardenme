<?php

namespace Garden\Controllers;

use Garden\DAO\OrdemDePedidoDAO;
use Garden\DAO\ItensDoPedidoDAO;
use Garden\DAO\ProdutoDAO;
use Garden\DAO\EnderecoDAO;
use Garden\Models\OrdemDePedido;
use Garden\Models\ItensDoPedido;
use Garden\Middleware\AuthMiddleware;

class OrdemDePedidoController
{
    private OrdemDePedidoDAO $ordemDePedidoDAO;
    private ItensDoPedidoDAO $itensDoPedidoDAO;
    private ProdutoDAO $produtoDAO;
    private EnderecoDAO $enderecoDAO;

    public function __construct()
    {
        $this->ordemDePedidoDAO = new OrdemDePedidoDAO();
        $this->itensDoPedidoDAO = new ItensDoPedidoDAO();
        $this->produtoDAO = new ProdutoDAO();
        $this->enderecoDAO = new EnderecoDAO(); 
    }

    public function detalhar(int $id)
    {
        // Bloco de verificação de autenticação
        $resultadoAuth = AuthMiddleware::verificar();
        if (isset($resultadoAuth['status']) && $resultadoAuth['status'] === 401) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['mensagem' => $resultadoAuth['mensagem']]);
            return;
        }
        $dadosToken = $resultadoAuth;
        // Fim do bloco de verificação

        $idUsuarioLogado = $dadosToken->data->id_usuario;
        // Lógica para verificar se o usuário é admin viria aqui, possivelmente do $dadosToken
        $isAdmin = $dadosToken->data->is_admin ?? false; 

        $pedido = $this->ordemDePedidoDAO->buscarPorId($id);

        if (!$pedido) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Pedido não encontrado.']);
            return;
        }

        if ($pedido->getIdUsuario() !== $idUsuarioLogado && !$isAdmin) {
            http_response_code(403); // Forbidden
            echo json_encode(['mensagem' => 'Acesso negado.']);
            return;
        }
        
        $itens = $this->itensDoPedidoDAO->buscarPorPedidoId($id);

        header('Content-Type: application/json');
        echo json_encode([
            'pedido' => $pedido,
            'itens' => $itens
        ]);
    }
    
    public function criar(object $dadosToken)
    {
        $idUsuario = $dadosToken->data->id_usuario;
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (!isset($dadosCorpo->id_endereco) || !isset($dadosCorpo->itens) || !is_array($dadosCorpo->itens) || empty($dadosCorpo->itens)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Dados incompletos para criar o pedido.']);
            return;
        }
        
        $precoTotalCalculado = 0.0;
        $valorFreteCalculado = 25.0; 

        foreach ($dadosCorpo->itens as $item) {
            $produto = $this->produtoDAO->buscarPorId($item->id_produto);
            
            if (!$produto) {
                http_response_code(404);
                echo json_encode(['mensagem' => "Produto com ID {$item->id_produto} não encontrado."]);
                return;
            }
            $precoTotalCalculado += $produto->getPreco() * $item->quantidade;
        }

        $novoPedido = new OrdemDePedido(
            idUsuario: $idUsuario,
            idEndereco: (int) $dadosCorpo->id_endereco,
            idStatus: 1,
            precoTotal: $precoTotalCalculado,
            valorFrete: $valorFreteCalculado,
            pagamentoMetodo: $dadosCorpo->pagamento_metodo ?? 'Não definido',
            pagamentoStatus: $dadosCorpo->pagamento_status ?? 'pendente'
        );

        $idNovoPedido = $this->ordemDePedidoDAO->criar($novoPedido);

        if (!$idNovoPedido) {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao criar o registro do pedido.']);
            return;
        }
        
        foreach ($dadosCorpo->itens as $item) {
            $novoItem = new ItensDoPedido(
                idPedido: $idNovoPedido,
                idProduto: $item->id_produto,
                quantidade: $item->quantidade,
                precoUnitario: $item->preco_unitario // Preço do momento da compra
            );
            $this->itensDoPedidoDAO->criar($novoItem);
        }

        http_response_code(201);
        echo json_encode(['mensagem' => 'Pedido criado com sucesso.', 'data' => ['id_pedido' => $idNovoPedido]]);
    }

        public function listarPedidosComDetalhes(object $dadosToken): array
    {
        try {
            $idUsuario = $dadosToken->data->id_usuario;
            $pedidos = $this->ordemDePedidoDAO->buscarPorUsuarioId($idUsuario);

            $pedidosComDetalhes = [];
            foreach ($pedidos as $pedido) {
                // Busca os itens do pedido
                $itensDoPedido = $this->itensDoPedidoDAO->buscarPorPedidoId($pedido->getId());
                $itensComDetalhes = [];
                foreach ($itensDoPedido as $item) {
                    $produto = $this->produtoDAO->buscarPorId($item->getIdProduto());
                    $itensComDetalhes[] = [
                        'id_produto' => $item->getIdProduto(),
                        'quantidade' => $item->getQuantidade(),
                        'preco_unitario' => $item->getPrecoUnitario(),
                        'name' => $produto ? $produto->getNomeProduto() : 'Produto Não Encontrado'
                    ];
                }

                // Busca o endereço do pedido
                $endereco = $this->enderecoDAO->buscarPorId($pedido->getIdEndereco());
                $enderecoDetalhes = $endereco ? [
                    'id_endereco' => $endereco->getId(),
                    'apelido' => $endereco->getApelido(),
                    'logradouro' => $endereco->getLogradouro(),
                    'numero' => $endereco->getNumero(),
                    'bairro' => $endereco->getBairro(),
                    'cidade' => $endereco->getCidade(),
                    'estado' => $endereco->getEstado(),
                    'cep' => $endereco->getCep(),
                ] : null;

                // Monta a estrutura completa do pedido
                $pedidosComDetalhes[] = [
                    'id_pedido' => $pedido->getId(),
                    'preco_total' => $pedido->getPrecoTotal(),
                    'criado_em' => $pedido->getCriadoEm(),
                    'id_status' => $pedido->getIdStatus(),
                    'itens' => $itensComDetalhes,
                    'endereco' => $enderecoDetalhes
                ];
            }
            return $pedidosComDetalhes;
        } catch (\Exception $e) {
            error_log('Erro ao listar pedidos com detalhes: ' . $e->getMessage());
            return [];
        }
    }

}