<?php
// Arquivo: public/test-registrar.php

require __DIR__ . '/../vendor/autoload.php';

use Garden\Dao\UsuarioDAO;
use Garden\Models\Usuario;

// Headers básicos
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

try {
    // 1️⃣ Ler corpo JSON
    $input = file_get_contents('php://input');
    error_log("INPUT RECEBIDO: " . $input);

    $dadosCorpo = json_decode($input, true);
    error_log("DECODE JSON: " . var_export($dadosCorpo, true));

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new \Exception('JSON inválido: ' . json_last_error_msg());
    }

    // 2️⃣ Verificar campos obrigatórios
    foreach (['nome', 'email', 'senha'] as $campo) {
        if (empty($dadosCorpo[$campo])) {
            throw new \Exception("Campo obrigatório ausente: $campo");
        }
    }

    // 3️⃣ Criar objeto Usuario
    $usuario = new Usuario(
        nome: $dadosCorpo['nome'],
        sobrenome: $dadosCorpo['sobrenome'] ?? '',
        email: $dadosCorpo['email'],
        celular: $dadosCorpo['celular'] ?? null,
        isAdmin: false
    );

    // 4️⃣ Inserir no banco
    $usuarioDAO = new UsuarioDAO();
    $resultado = $usuarioDAO->criar($usuario, $dadosCorpo['senha']);
    error_log('Retorno UsuarioDAO::criar -> ' . var_export($resultado, true));

    // 5️⃣ Resposta final
    if ($resultado === 'conflict') {
        http_response_code(409);
        echo json_encode(['mensagem' => 'Email já cadastrado.']);
    } elseif ($resultado !== false && is_int($resultado)) {
        http_response_code(201);
        echo json_encode(['mensagem' => 'Usuário criado com sucesso', 'id_usuario' => $resultado]);
    } else {
        throw new \Exception("Falha desconhecida ao criar usuário");
    }

} catch (\Throwable $e) {
    error_log('Erro em test-registrar.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'mensagem' => 'Erro interno no servidor',
        'detalhes' => $e->getMessage()
    ]);
}
