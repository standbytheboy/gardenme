<?php

namespace Garden\Controllers;

use Garden\Dao\UsuarioDAO;
use Garden\Models\Usuario;
use Firebase\JWT\JWT;

class AuthController
{
    public function registrar()
    {
        $dadosCorpo = json_decode(file_get_contents('php://input'));

        if (!isset($dadosCorpo->nome) || !isset($dadosCorpo->email) || !isset($dadosCorpo->senha)) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Nome, e-mail e senha são obrigatórios.']);
            return;
        }

        if (filter_var($dadosCorpo->email, FILTER_VALIDATE_EMAIL) === false) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'O formato do e-mail é inválido.']);
            return;
        }

        if (strlen($dadosCorpo->senha) < 6) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'A senha deve ter no mínimo 6 caracteres.']);
            return;
        }

        $usuario = new Usuario(
            nome: $dadosCorpo->nome,
            sobrenome: $dadosCorpo->sobrenome ?? '',
            email: $dadosCorpo->email,
            celular: $dadosCorpo->celular ?? null
        );

        $usuarioDAO = new UsuarioDAO();
        $resultado = $usuarioDAO->criar($usuario, $dadosCorpo->senha);

        header('Content-Type: application/json');
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

            $chaveSecreta = $_ENV['JWT_SECRET'];
            $payload = [
                'iss' => 'http://localhost/gardenme',
                'aud' => 'http://localhost/gardenme',
                'iat' => time(),
                'exp' => time() + (60 * 60),
                'data' => [
                    'id_usuario' => $usuario['id_usuario'],
                    'nome' => $usuario['nome'],
                    'email' => $usuario['email']
                ]
            ];

            $token = JWT::encode($payload, $chaveSecreta, 'HS256');

            http_response_code(200);
            echo json_encode([
                'mensagem' => 'Login bem-sucedido!',
                'token' => $token
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['mensagem' => 'Email ou senha inválidos.']);
        }
    }


    public function logout()
    {
        http_response_code(200);
        echo json_encode(['mensagem' => 'Logout realizado com sucesso.']);
    }
}
