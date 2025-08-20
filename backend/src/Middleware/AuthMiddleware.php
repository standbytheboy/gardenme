<?php

namespace Garden\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public static function verificar()
    {
        $chaveSecreta = getenv('JWT_SECRET') ?: "fallback_secret";

        if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return ['status' => 401, 'mensagem' => 'Acesso negado. Token não fornecido.'];
        }

        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        $arr = explode(' ', $authHeader);
        $token = $arr[1] ?? '';

        if (!$token) {
            return ['status' => 401, 'mensagem' => 'Acesso negado. Token malformado.'];
        }

        try {
            $decoded = JWT::decode($token, new Key($chaveSecreta, 'HS256'));
            return $decoded; 
        } catch (\Exception $e) {
            return ['status' => 401, 'mensagem' => 'Acesso negado. Token inválido: Faça Login!'];
        }
    }
}