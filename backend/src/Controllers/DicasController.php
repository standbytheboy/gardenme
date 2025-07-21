<?php
namespace Garden\Controllers;

use Garden\Dao\DicasDAO;
use Garden\Models\Dicas;

class DicasController {
    private DicasDAO $dicasDAO;

    public function __construct() {
        $this->dicasDAO = new DicasDAO();
    }

    public function listar() {
        $dicas = $this->dicasDAO->listarTodos();
        $resultado = array_map(function ($dica) {
            return [
                'id_dica' => $dica->getId(),
                'titulo' => $dica->getTituloDica(),
                'conteudo' => $dica->getConteudoDica(),
                'id_produto' => $dica->getIdProduto()
            ];
        }, $dicas);
        header('content-type: application/json');
        echo json_encode($resultado);
    }

    public function detalhar(int $id) {
        $dicas = $this->dicasDAO->buscarPorId($id);

        header('Content-Type: application/json');
        if ($dicas) {
            $resultado = [
                'id_dica' => $dicas->getId(),
                'titulo' => $dicas->getTituloDica(),
                'conteudo' => $dicas->getConteudoDica(),
                'criado_em' => $dicas->getCriadoEm(),
                'atualizado_em' => $dicas->getAtualizadoEm()
            ];
            echo json_encode($resultado);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Dica não encontrada.']);
        }
    }

    public function criar() {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if(!isset($dadosCorpo->tituloDica) || empty($dadosCorpo->tituloDica)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'O campo tituloDica é obrigatório.']);
            return;
        }

        $dicas = new Dicas(
            tituloDica: $dadosCorpo->tituloDica,
            conteudoDica: $dadosCorpo->conteudoDica ?? '',
            idProduto: $dadosCorpo->idProduto ?? null
        );

        $novoId = $this->dicasDAO->criar($dicas);

        if($novoId) {
            http_response_code(201);
            echo json_encode(['id_dica' => $novoId]);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao criar a dica.']);
        }
    }

    public function atualizar(int $id) {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if(!isset($dadosCorpo->tituloDica) || empty($dadosCorpo->tituloDica)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'O campo tituloDica é obrigatório.']);
            return;
        }

        $dicas = new Dicas(
            idDica: $id,
            tituloDica: $dadosCorpo->tituloDica,
            conteudoDica: $dadosCorpo->conteudoDica ?? '',
            idProduto: $dadosCorpo->idProduto ?? null
        );

        $sucesso = $this->dicasDAO->atualizar($dicas);

        if($sucesso) {
            http_response_code(200);
            echo json_encode(['mensagem' => 'Dica atualizada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao atualizar a dica.']);
        }
    }

    public function deletar(int $id) {
        $sucesso = $this->dicasDAO->deletar($id);

        if($sucesso) {
            http_response_code(200);
            echo json_encode(['mensagem' => 'Dica deletada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao deletar a dica.']);
        }
    }
}