<?php

ob_start();

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

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$basePath = '/gardenme/backend/public';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$route = str_replace($basePath, '', $path);
$controller = null;

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

if (preg_match('#^/api/categorias(/(\d+))?$#', $route, $matches)) {
    $id = $matches[2] ?? null;
    $controller = new CategoriaController();

    if ($id) {
        if ($method === 'GET') $controller->detalhar($id);
        if ($method === 'PUT') $controller->atualizar($id);
        if ($method === 'DELETE') $controller->deletar($id);
    } else {
        if ($method === 'GET') $controller->listar();
        if ($method === 'POST') $controller->criar();
    }
    ob_end_clean();
    exit();
}

if (preg_match('#^/api/dicas(/(\d+))?$#', $route, $matches)) {
    $id = $matches[2] ?? null;
    $controller = new DicasController();

    if ($id) {
        if ($method === 'GET') $controller->detalhar($id);
        if ($method === 'PUT') {
            AuthMiddleware::verificar();
            $controller->atualizar($id);
        }
        if ($method === 'DELETE') {
            AuthMiddleware::verificar();
            $controller->deletar($id);
        }
    } else {
        if ($method === 'GET') $controller->listar();
        if ($method === 'POST') {
            AuthMiddleware::verificar();
            $controller->criar();
        }
    }
    ob_end_clean();
    exit();
}

if (preg_match('#^/api/usuarios/(\d+)/enderecos$#', $route, $matches)) {
    $dadosToken = AuthMiddleware::verificar();
    $id_usuario = (int)$matches[1];
    $controller = new EnderecoController();

    if ($method === 'GET') {
        $controller->listarPorUsuario($id_usuario, $dadosToken);
    }
    if ($method === 'POST') {
        $controller->criar($id_usuario, $dadosToken);
    }
    ob_end_clean();
    exit();
}

if (preg_match('#^/api/enderecos/(\d+)$#', $route, $matches)) {
    $dadosToken = AuthMiddleware::verificar();
    $id_endereco = (int)$matches[1];
    $controller = new EnderecoController();

    if ($method === 'PUT') {
        $controller->atualizar($id_endereco, $dadosToken);
    }
    if ($method === 'DELETE') {
        $controller->deletar($id_endereco, $dadosToken);
    }
    ob_end_clean();
    exit();
}

if (preg_match('#^/api/usuarios/(\d+)$#', $route, $matches)) {
    $dadosToken = AuthMiddleware::verificar();
    $id = (int)$matches[1];
    $controller = new UsuarioController();

    if ($method === 'GET') $controller->buscar($id, $dadosToken);
    if ($method === 'PUT') $controller->atualizar($id, $dadosToken);
    if ($method === 'DELETE') $controller->deletar($id, $dadosToken);

    ob_end_clean();
    exit();
}

http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);