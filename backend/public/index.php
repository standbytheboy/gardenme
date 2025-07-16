<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../autoload.php';

use Garden\Controllers\CategoriaController;
use Garden\Controllers\AuthController;
use Garden\Controllers\UsuarioController; 


$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$basePath = '/gardenme/backend/public'; 

if ($method === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

$route = str_replace($basePath, '', $path);

if ($route === '/api/registrar' && $method === 'POST') {
    (new AuthController())->registrar();
    exit();
}

if ($route === '/api/login' && $method === 'POST') {
    (new AuthController())->login();
    exit();
}

if (preg_match('#^/api/categorias/(\d+)$#', $route, $matches)) {
    $id = (int)$matches[1];
    $controller = new CategoriaController();
    
    if ($method === 'GET') $controller->detalhar($id);
    if ($method === 'PUT') $controller->atualizar($id);
    if ($method === 'DELETE') $controller->deletar($id);
    exit();
}

if ($route === '/api/categorias' && $method === 'GET') {
    (new CategoriaController())->listar();
    exit();
}

if ($route === '/api/categorias' && $method === 'POST') {
    (new CategoriaController())->criar();
    exit();
}

if (preg_match('#^/api/usuarios/(\d+)$#', $route, $matches)) {
    $id = (int)$matches[1];
    if ($method === 'GET') {
        (new UsuarioController())->buscar($id);
    }
    exit();
}

http_response_code(404);
echo json_encode(['mensagem' => 'Endpoint não encontrado']);