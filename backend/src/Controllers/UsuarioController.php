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
}