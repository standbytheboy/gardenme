<?php
namespace Garden\Controllers;

use Garden\Dao\UsuarioDAO;
use Garden\Models\Usuario;
use Firebase\JWT\JWT;

class AuthController
{
    public function registrar()
    {
        try {
            $input = file_get_contents('php://input');
            $dadosCorpo = json_decode($input);

            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'JSON inválido', 'erro' => json_last_error_msg()]);
                error_log('JSON inválido recebido: ' . $input);
                return;
            }

            if (!isset($dadosCorpo->nome, $dadosCorpo->email, $dadosCorpo->senha)) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'Nome, e-mail e senha são obrigatórios.']);
                return;
            }

            if (!filter_var($dadosCorpo->email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'Formato de e-mail inválido.']);
                return;
            }

            if (strlen($dadosCorpo->senha) < 6) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'Senha deve ter no mínimo 6 caracteres.']);
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

            if ($resultado === 'conflict') {
                http_response_code(409);
                echo json_encode(['mensagem' => 'Email já cadastrado.']);
            } elseif ($resultado) {
                http_response_code(201);
                echo json_encode(['mensagem' => 'Usuário criado com sucesso.', 'id_usuario' => $resultado]);
            } else {
                http_response_code(500);
                echo json_encode(['mensagem' => 'Erro interno ao criar usuário.']);
            }

        } catch (\Exception $e) {
            error_log('Erro em registrar(): ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno no servidor', 'detalhes' => $e->getMessage()]);
        }
    }

    public function login()
    {
        try {
            $input = file_get_contents('php://input');
            $dadosCorpo = json_decode($input);

            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'JSON inválido', 'erro' => json_last_error_msg()]);
                error_log('JSON inválido recebido: ' . $input);
                return;
            }

            if (!isset($dadosCorpo->email, $dadosCorpo->senha)) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'Email e senha obrigatórios.']);
                return;
            }

            $usuarioDAO = new UsuarioDAO();
            $usuario = $usuarioDAO->buscarPorEmail($dadosCorpo->email);

            if ($usuario && password_verify($dadosCorpo->senha, $usuario['senha_hash'])) {

                $chaveSecreta = getenv('JWT_SECRET') ?: "fallback_secret";
                $payload = [
                    'iss' => 'http://localhost/gardenme',
                    'aud' => 'http://localhost/gardenme',
                    'iat' => time(),
                    'exp' => time() + 3600,
                    'data' => [
                        'id_usuario' => $usuario['id_usuario'],
                        'nome' => $usuario['nome'],
                        'email' => $usuario['email']
                    ]
                ];

                $token = JWT::encode($payload, $chaveSecreta, 'HS256');

                http_response_code(200);
                echo json_encode(['mensagem' => 'Login bem-sucedido!', 'token' => $token]);

            } else {
                http_response_code(401);
                echo json_encode(['mensagem' => 'Email ou senha inválidos.']);
            }

        } catch (\Exception $e) {
            error_log('Erro em login(): ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro interno no servidor', 'detalhes' => $e->getMessage()]);
        }
    }

    public function logout()
    {
        http_response_code(200);
        echo json_encode(['mensagem' => 'Logout realizado com sucesso.']);
    }
}
