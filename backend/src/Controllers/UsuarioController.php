<?php

namespace Garden\Controllers;

use Garden\DAO\UsuarioDAO;

class UsuarioController
{
    public function buscar(int $id)
    {
        $usuarioDAO = new UsuarioDAO();
        $usuario = $usuarioDAO->buscarPorId($id);
        header('Content-Type: application/json');
        if ($usuario) {
            $resultado = [
                'id' => $usuario->getId(),
                'nome' => $usuario->getNome(),
                'sobrenome' => $usuario->getSobrenome(),
                'email' => $usuario->getEmail(),
                'celular' => $usuario->getCelular()
            ];
            echo json_encode($resultado);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Usuário não encontrado.']);
        }
    }

    public function atualizar(int $id)
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'), true);

        if (empty($dadosCorpo)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Nenhum dado fornecido para atualização.']);
            return;
        }

        $usuarioDAO = new UsuarioDAO();
        $sucesso = $usuarioDAO->atualizar($id, $dadosCorpo);

        header('Content-Type: application/json');
        if ($sucesso) {
            echo json_encode(['mensagem' => 'Usuário atualizado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao atualizar usuário.']);
        }
    }

    public function deletar(int $id)
    {
        $usuarioDAO = new UsuarioDAO();
        $sucesso = $usuarioDAO->deletar($id);

        header('Content-Type: application/json');
        if ($sucesso) {
            echo json_encode(['mensagem' => 'Usuário deletado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao deletar usuário ou usuário não encontrado.']);
        }
    }

}
