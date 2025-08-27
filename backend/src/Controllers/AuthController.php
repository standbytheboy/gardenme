<?php
namespace Garden\Controllers;

use Garden\Dao\UsuarioDao;
use Garden\models\Usuario;
use Firebase\JWT\JWT;

class AuthController
{
    // Em backend/src/Controllers/AuthController.php

public function registrar()
{
    // Limpa qualquer saída de buffer que possa ter ocorrido antes
    while (ob_get_level()) {
        ob_end_clean();
    }

    // Garante que a resposta será sempre JSON
    header('Content-Type: application/json; charset=utf-8');

    try {
        $input = file_get_contents('php://input');
        $dadosCorpo = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Corpo da requisição não é um JSON válido: ' . json_last_error_msg()]);
            exit;
        }

        if (empty($dadosCorpo['nome']) || empty($dadosCorpo['email']) || empty($dadosCorpo['senha'])) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Nome, e-mail e senha são obrigatórios.']);
            exit;
        }
        
        // Outras validações...

        $usuario = new \Garden\models\Usuario(
            nome: $dadosCorpo['nome'],
            sobrenome: $dadosCorpo['sobrenome'] ?? '',
            email: $dadosCorpo['email'],
            celular: $dadosCorpo['celular'] ?? null,
            isAdmin: false
        );

        $usuarioDao = new \Garden\Dao\UsuarioDao();
        $resultado = $usuarioDao->criar($usuario, $dadosCorpo['senha']);

        if ($resultado === 'conflict') {
            http_response_code(409); // Conflict
            echo json_encode(['mensagem' => 'O e-mail fornecido já está em uso.']);
        } elseif ($resultado) {
            http_response_code(201); // Created
            echo json_encode([
                'mensagem' => 'Usuário criado com sucesso.',
                'id_usuario' => $resultado
            ]);
        } else {
            // Se o Dao retornou 'false' por um motivo inesperado
            http_response_code(500);
            echo json_encode(['mensagem' => 'Ocorreu um erro inesperado ao criar o usuário.']);
        }

    } catch (\PDOException $pdoe) {
        // Erro específico do banco de dados
        http_response_code(500);
        error_log('Erro de PDO em registrar(): ' . $pdoe->getMessage()); // Loga o erro real
        echo json_encode([
            'mensagem' => 'Erro de comunicação com o banco de dados.',
            'detalhes' => 'Verifique as credenciais e a conexão.' // Mensagem segura para o frontend
        ]);
    } catch (\Throwable $e) {
        // Captura qualquer outro erro
        http_response_code(500);
        error_log('Erro geral em registrar(): ' . $e->getMessage()); // Loga o erro real
        echo json_encode([
            'mensagem' => 'Erro interno no servidor.',
            'detalhes' => $e->getMessage()
        ]);
    }
    exit;
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

            $usuarioDao = new UsuarioDao();
            $usuario = $usuarioDao->buscarPorEmail($dadosCorpo->email);

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
                echo json_encode(['mensagem' => 'Login bem-sucedido!', 'token' => $token, 'idDoUsuario' => $usuario['id_usuario']]);

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
