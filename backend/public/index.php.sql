<?php
// Caminho do log
define('LOG_PATH', __DIR__ . '/logs/debug.log');

// Habilita todos os erros PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cria a pasta de logs se não existir
if (!is_dir(__DIR__ . '/logs')) {
    mkdir(__DIR__ . '/logs', 0777, true);
}

// Função de log simples
function logMsg($msg) {
    file_put_contents(LOG_PATH, date('[Y-m-d H:i:s] ') . $msg . "\n", FILE_APPEND);
}

// Log inicial
logMsg("index.php chamado");

// Captura erros fatais
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    logMsg("Erro: [$errno] $errstr em $errfile:$errline");
    echo "Erro detectado: $errstr";
});

set_exception_handler(function($e) {
    logMsg("Exceção: " . $e->getMessage() . "\n" . $e->getTraceAsString());
    echo "Exceção capturada: " . $e->getMessage();
});

// Teste autoload
$autoload_path = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoload_path)) {
    logMsg("Autoload não encontrado: $autoload_path");
    die("Autoload não encontrado");
}

try {
    require $autoload_path;
    logMsg("Autoload carregado com sucesso");
} catch (\Throwable $e) {
    logMsg("Erro ao carregar autoload: " . $e->getMessage());
    die("Erro crítico ao carregar autoload");
}

// Log rota
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
logMsg("Rota chamada: $uri");
$method = $_SERVER['REQUEST_METHOD'];
logMsg("Método: $method");

// Apenas para teste: rota /api/registrar
if ($uri === '/api/registrar' && $method === 'POST') {
    logMsg("Chamando AuthController->registrar()");
    try {
        (new \Garden\Controllers\AuthController())->registrar();
    } catch (\Throwable $e) {
        logMsg("Erro registrar: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro interno no servidor.']);
    }
    exit();
}

// Rotas genéricas
http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);
logMsg("Rota não encontrada: $uri");
