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

        $resultado = $this->categoriaDAO->criar($categoria);

        if ($resultado === 'conflict') {
            http_response_code(409);
            echo json_encode(['mensagem' => 'Erro ao criar a categoria. O nome já está em uso.']);
        } elseif ($resultado) {
            http_response_code(201);
            echo json_encode(['id_categoria' => $resultado, 'mensagem' => 'Categoria criada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao criar a categoria.']);
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

        $categoriaExistente = $this->categoriaDAO->buscarPorId($id);

        if (!$categoriaExistente) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Categoria não encontrada para atualização.']);
            return;
        }

        $categoriaParaAtualizar = new Categoria(
            idCategoria: $id,
            nomeCategoria: $dadosCorpo->nome_categoria,
            criadoEm: null,
            atualizacaoEm: null
        );

        $resultado = $this->categoriaDAO->atualizar($categoriaParaAtualizar);

        header('Content-Type: application/json');
        if ($resultado === 'conflict') {
            http_response_code(409);
            echo json_encode(['mensagem' => 'Erro ao atualizar: o nome da categoria já está em uso.']);
        } elseif ($resultado) {
            echo json_encode(['mensagem' => 'Categoria atualizada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno ao tentar atualizar a categoria.']);
        }
    }

    public function deletar(int $id)
    {
        $dadosToken = \Garden\Middleware\AuthMiddleware::verificar();
        $idUsuarioLogado = $dadosToken->data->id_usuario;

        $usuarioDAO = new \Garden\Dao\UsuarioDAO();
        $usuario = $usuarioDAO->buscarPorId($idUsuarioLogado);

        if (!$usuario || !$usuario->isAdmin()) {
            http_response_code(403);
            echo json_encode(['mensagem' => 'Acesso negado. Apenas administradores podem executar esta ação.']);
            return;
        }

        $categoriaDAO = new CategoriaDAO();
        $categoria = $categoriaDAO->buscarPorId($id);

        if (!$categoria) {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Categoria não encontrada.']);
            return;
        }

        $sucesso = $categoriaDAO->deletar($id);

        if ($sucesso) {
            http_response_code(200);
            echo json_encode(['mensagem' => 'Categoria deletada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao deletar categoria.']);
        }
    }
}
