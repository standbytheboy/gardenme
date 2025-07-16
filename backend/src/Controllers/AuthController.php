<?php

namespace Garden\Controllers;

use Garden\Dao\UsuarioDAO;
use Garden\Models\Usuario;

class AuthController
{
    public function registrar()
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (!isset($dadosCorpo->nome) || !isset($dadosCorpo->email) || !isset($dadosCorpo->senha)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Dados incompletos...']);
            return;
        }

        $usuario = new Usuario(
            nome: $dadosCorpo->nome,
            sobrenome: $dadosCorpo->sobrenome ?? '',
            email: $dadosCorpo->email,
            celular: $dadosCorpo->celular ?? null
        );

        $usuarioDAO = new UsuarioDAO();
        $novoId = $usuarioDAO->criar($usuario, $dadosCorpo->senha);

        header('Content-Type: application/json');
        if ($novoId) {
            http_response_code(201);
            echo json_encode(['id_usuario' => $novoId, 'mensagem' => 'Usuário criado com sucesso!']);
        } else {
            http_response_code(409);
            echo json_encode(['mensagem' => 'Erro ao criar usuário. O e-mail pode já estar em uso.']);
        }
    }

    public function login()
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (!isset($dadosCorpo->email) || !isset($dadosCorpo->senha)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Email e senha são obrigatórios.']);
            return;
        }

        $usuarioDAO = new UsuarioDAO();
        $usuario = $usuarioDAO->buscarPorEmail($dadosCorpo->email);

        if ($usuario && password_verify($dadosCorpo->senha, $usuario['senha_hash'])) {
            http_response_code(200); // OK
            echo json_encode([
                'mensagem' => 'Login bem-sucedido!',
                'id_usuario' => $usuario['id_usuario'],
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['mensagem' => 'Email ou senha inválidos.']);
        }
    }
}