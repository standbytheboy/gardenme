<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Garden\Middleware\AuthMiddleware;
use Garden\Controllers\CategoriaController;
use Garden\Controllers\AuthController;
use Garden\Controllers\UsuarioController; 

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

// ...
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
    exit();
}

if (preg_match('#^/api/usuarios/(\d+)$#', $route, $matches)) {
    AuthMiddleware::verificar(); 

    $id = (int)$matches[1];
    $controller = new UsuarioController();

    if ($method === 'GET') {
        $controller->buscar($id);
    }

    if ($method === 'PUT') { 
        $controller->atualizar($id); 
    }
    
    if ($method === 'DELETE') {
        $controller->deletar($id);
    }
    
    exit();
}

http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);