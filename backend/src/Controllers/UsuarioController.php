<?php
namespace Garden\Controllers;
use Garden\DAO\UsuarioDAO;

class UsuarioController
{
    // Este método busca um usuário. A lógica de quem pode buscar qual ID
    // será controlada pelo Middleware e pelo Roteador.
    public function buscar(int $id)
    {
        $usuarioDAO = new UsuarioDAO();
        $usuario = $usuarioDAO->buscarPorId($id); // Este método retorna um objeto Usuario
        header('Content-Type: application/json');
        if ($usuario) {
            // Monta a resposta segura, sem a senha
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