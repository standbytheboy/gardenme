<?php

namespace Garden\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public static function verificar()
    {
        $chaveSecreta = getenv('JWT_SECRET') ?? "1CbXldbPUZBV0LRmqVt6RYnqFJTHtrYa";

        if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
            http_response_code(401);
            echo json_encode(['mensagem' => 'Acesso negado. Token não fornecido.']);
            exit();
        }

        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        $arr = explode(' ', $authHeader);
        $token = $arr[1] ?? '';

        if (!$token) {
            http_response_code(401);
            echo json_encode(['mensagem' => 'Acesso negado. Token malformado.']);
            exit();
        }

        try {
            $decoded = JWT::decode($token, new Key($chaveSecreta, 'HS256'));
            return $decoded; 
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['mensagem' => 'Acesso negado. Token inválido: ' . $e->getMessage()]);
            exit();
        }
    }
}