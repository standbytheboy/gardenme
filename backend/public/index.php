<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

header('Content-Type: application/json');

require __DIR__ . '/../vendor/autoload.php';

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
} catch (\Dotenv\Exception\InvalidPathException $e) {
    try {
        $dotenv = Dotenv\Dotenv::createImmutable('C:/xampp/htdocs/gardenme/backend/');
        $dotenv->load();
    } catch (\Exception $ex) {
        die("Erro crítico: não foi possível carregar o arquivo .env. Verifique o caminho e as permissões. Erro: " . $ex->getMessage());
    }
}

use Garden\Middleware\AuthMiddleware;
use Garden\Controllers\CategoriaController;
use Garden\Controllers\AuthController;
use Garden\Controllers\UsuarioController;
use Garden\Controllers\DicasController;
use Garden\Controllers\EnderecoController;
use Garden\Controllers\FotoController; // Novo controller para foto

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$basePath = '/gardenme/backend/public';
$route = str_replace($basePath, '', $path);
$controller = null;
$dadosToken = null;

if ($route === '/api/registrar' && $method === 'POST') {
    (new AuthController())->registrar();
    exit();
}
if ($route === '/api/login' && $method === 'POST') {
    (new AuthController())->login();
    exit();
}
if ($route === '/api/logout' && $method === 'POST') {
    AuthMiddleware::verificar();
    (new AuthController())->logout();
    exit();
}

// Roteamento que exige autenticação
$requiresAuth = [
    '#^/api/dicas$#' => ['POST'],
    '#^/api/dicas/(\d+)$#' => ['PUT', 'DELETE'],
    '#^/api/usuarios/(\d+)/enderecos$#' => ['GET', 'POST'],
    '#^/api/enderecos/(\d+)$#' => ['PUT', 'DELETE'],
    '#^/api/usuarios/(\d+)$#' => ['GET', 'PUT', 'DELETE'],
    '#^/api/categorias/(\d+)$#' => ['DELETE'],
    '#^/api/usuarios/(\d+)/foto$#' => ['POST', 'DELETE'],
];

foreach ($requiresAuth as $pattern => $methods) {
    if (preg_match($pattern, $route, $matches) && in_array($method, $methods)) {
        $authResult = AuthMiddleware::verificar();
        // Verifica se o resultado é um array (indicando um erro) antes de tentar acessar 'status'
        if (is_array($authResult) && isset($authResult['status'])) {
            http_response_code($authResult['status']);
            echo json_encode(['mensagem' => $authResult['mensagem']]);
            exit();
        }
        $dadosToken = $authResult;
        break; 
    }
}


if (preg_match('#^/api/categorias(/(\d+))?$#', $route, $matches)) {
    $id = $matches[2] ?? null;
    $controller = new CategoriaController();
    if ($id) {
        if ($method === 'GET') $controller->detalhar($id);
        if ($method === 'PUT') $controller->atualizar($id);
        if ($method === 'DELETE' && $dadosToken) $controller->deletar($id);
    } else {
        if ($method === 'GET') $controller->listar();
        if ($method === 'POST') $controller->criar();
    }
    exit();
}

if (preg_match('#^/api/dicas(/(\d+))?$#', $route, $matches)) {
    $id = $matches[2] ?? null;
    $controller = new DicasController();
    if ($id) {
        if ($method === 'GET') $controller->detalhar($id);
        if ($method === 'PUT' && $dadosToken) $controller->atualizar($id);
        if ($method === 'DELETE' && $dadosToken) $controller->deletar($id);
    } else {
        if ($method === 'GET') $controller->listar();
        if ($method === 'POST' && $dadosToken) $controller->criar();
    }
    exit();
}

if (preg_match('#^/api/usuarios/(\d+)/enderecos$#', $route, $matches)) {
    $id_usuario = (int)$matches[1];
    $controller = new EnderecoController();
    if ($method === 'GET' && $dadosToken) {
        $controller->listarPorUsuario($id_usuario, $dadosToken);
    }
    if ($method === 'POST' && $dadosToken) {
        $controller->criar($id_usuario, $dadosToken);
    }
    exit();
}

if (preg_match('#^/api/enderecos/(\d+)$#', $route, $matches)) {
    $id_endereco = (int)$matches[1];
    $controller = new EnderecoController();
    if ($method === 'PUT' && $dadosToken) {
        $controller->atualizar($id_endereco, $dadosToken);
    }
    if ($method === 'DELETE' && $dadosToken) {
        $controller->deletar($id_endereco, $dadosToken);
    }
    exit();
}

if (preg_match('#^/api/usuarios/(\d+)$#', $route, $matches)) {
    $id = (int)$matches[1];
    $controller = new UsuarioController();
    if ($method === 'GET' && $dadosToken) $controller->buscar($id, $dadosToken);
    if ($method === 'PUT' && $dadosToken) $controller->atualizar($id, $dadosToken);
    if ($method === 'DELETE' && $dadosToken) $controller->deletar($id, $dadosToken);
    exit();
}

// Novos blocos de roteamento para as fotos
if (preg_match('#^/api/usuarios/(\d+)/foto$#', $route, $matches)) {
    $id_usuario = (int)$matches[1];
    $controller = new FotoController();
    if ($method === 'POST' && $dadosToken) {
        $controller->upload($id_usuario, $dadosToken);
    }
    if ($method === 'DELETE' && $dadosToken) {
        $controller->deletar($id_usuario, $dadosToken);
    }
    exit();
}

if (preg_match('#^/api/produtos(/(\d+))?$#', $route, $matches)) {
    $id = $matches[2] ?? null;
    $controller = new \Garden\Controllers\ProdutoController();
    if ($id) {
        if ($method === 'GET') $controller->detalhar((int)$id);
        if ($method === 'PUT') $controller->atualizar((int)$id);
        if ($method === 'DELETE') $controller->deletar((int)$id);
    } else {
        if ($method === 'GET') $controller->listar();
        if ($method === 'POST') $controller->criar();
    }
    exit();
}

http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);
exit();